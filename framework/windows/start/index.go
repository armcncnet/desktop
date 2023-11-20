/**
 ******************************************************************************
 * @file    index.go
 * @author  ARMCNC site:www.armcnc.net github:armcnc.github.io
 ******************************************************************************
 */

package StartWindows

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	runtime2 "github.com/wailsapp/wails/v2/pkg/runtime"
	"io"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"net/url"
	"os"
	"runtime"
	"strings"
	"time"
)

type Api struct {
	ctx context.Context
}

type ReturnResponse struct {
	Code int         `json:"code"`
	Data interface{} `json:"data"`
	Msg  string      `json:"msg"`
}

func Init() *Api {
	return &Api{}
}

func (start *Api) Startup(ctx context.Context) {
	start.ctx = ctx
}

func (start *Api) Shutdown(ctx context.Context) {

}

func (start *Api) GetPlatform() string {
	platform := ""
	switch runtime.GOOS {
	case "windows":
		platform = "Windows"
	case "darwin":
		platform = "Darwin"
	case "linux":
		platform = "Linux"
		content, err := os.ReadFile("/etc/os-release")
		if err == nil {
			lines := strings.Split(string(content), "\n")
			for _, line := range lines {
				if strings.HasPrefix(line, "ID=") {
					switch {
					case strings.Contains(line, "ubuntu"):
						platform = "Ubuntu"
					case strings.Contains(line, "debian"):
						platform = "Debian"
					default:
						platform = "Linux"
					}
				}
			}
		}
	default:
		platform = "-"
	}
	return platform
}

func (start *Api) OpenFile(title string, name string, pattern string) string {
	options := runtime2.OpenDialogOptions{}
	options.Title = title
	options.Filters = make([]runtime2.FileFilter, 0)
	options.Filters = append(options.Filters, runtime2.FileFilter{DisplayName: name, Pattern: pattern})
	file, _ := runtime2.OpenFileDialog(start.ctx, options)
	return file
}

func (start *Api) SaveFile(title string, name string) string {
	options := runtime2.SaveDialogOptions{}
	options.Title = title
	options.DefaultFilename = name
	path, _ := runtime2.SaveFileDialog(start.ctx, options)
	return path
}

func (start *Api) DownloadFile(url string, path string) bool {
	status := true

	resp, err := http.Get("http://" + url)
	if err != nil {
		status = false
	}
	defer resp.Body.Close()

	platform := start.GetPlatform()
	if platform == "Windows" {
		path = strings.Replace(path, `\`, `\\`, -1)
	}

	out, err := os.Create(path)
	if err != nil {
		status = false
	}
	defer out.Close()

	_, err = io.Copy(out, resp.Body)
	if err != nil {
		status = false
	}

	return status
}

func (start *Api) DeviceRequest(host string, path string, method string, parameter any) map[string]interface{} {

	response := map[string]interface{}{"code": 0}

	requestBody, err := json.Marshal(parameter)
	if err != nil {
		response["code"] = 10000
		return response
	}

	urlWithParams := "http://" + host + path
	if method == "GET" {
		queryParams := url.Values{}
		parameters := map[string]string{}
		json.Unmarshal(requestBody, &parameters)
		for key, value := range parameters {
			queryParams.Add(key, value)
		}
		urlWithParams += "?" + queryParams.Encode()
	}

	request, err := http.NewRequest(method, urlWithParams, bytes.NewReader(requestBody))
	if err != nil {
		response["code"] = 10000
		return response
	}

	responseBody, err := start.onRequest(request, "application/json", "")
	if err != nil {
		response["code"] = 10000
		return response
	}
	defer responseBody.Close()

	if err := json.NewDecoder(responseBody).Decode(&response); err != nil {
		response["code"] = 10000
		return response
	}

	return response
}

func (start *Api) DeviceUpload(host string, path string, method string, filePath string) map[string]interface{} {
	response := map[string]interface{}{"code": 0}

	urlWithParams := "http://" + host + path

	platform := start.GetPlatform()
	if platform == "Windows" {
		filePath = strings.Replace(filePath, `\`, `\\`, -1)
	}

	file, err := os.Open(filePath)
	if err != nil {
		response["code"] = 10000
		return response
	}
	defer file.Close()

	fileData, err := ioutil.ReadAll(file)
	if err != nil {
		response["code"] = 10000
		return response
	}

	fileBody := &bytes.Buffer{}
	fileWriter := multipart.NewWriter(fileBody)
	filePart, err := fileWriter.CreateFormFile("file", filePath)
	if err != nil {
		response["code"] = 10000
		return response
	}
	filePart.Write(fileData)
	fileWriter.Close()

	request, err := http.NewRequest(method, urlWithParams, fileBody)
	if err != nil {
		response["code"] = 10000
		return response
	}

	responseBody, err := start.onRequest(request, fileWriter.FormDataContentType(), "")
	if err != nil {
		response["code"] = 10000
		return response
	}
	defer responseBody.Close()

	if err := json.NewDecoder(responseBody).Decode(&response); err != nil {
		response["code"] = 10000
		return response
	}

	return response
}

func (start *Api) ServiceRequest(path string, method string, parameter any, token string) ReturnResponse {

	response := ReturnResponse{}

	requestBody, err := json.Marshal(parameter)
	if err != nil {
		response.Code = 10000
		return response
	}

	urlWithParams := "https://gateway.geekros.com" + path
	if method == "GET" {
		queryParams := url.Values{}
		parameters := map[string]string{}
		json.Unmarshal(requestBody, &parameters)
		for key, value := range parameters {
			queryParams.Add(key, value)
		}
		urlWithParams += "?" + queryParams.Encode()
	}

	request, err := http.NewRequest(method, urlWithParams, bytes.NewReader(requestBody))
	if err != nil {
		response.Code = 10000
		return response
	}

	responseBody, err := start.onRequest(request, "application/json", token)
	if err != nil {
		response.Code = 10000
		return response
	}
	defer responseBody.Close()

	if err := json.NewDecoder(responseBody).Decode(&response); err != nil {
		response.Code = 10000
		return response
	}

	return response
}

func (start *Api) onRequest(request *http.Request, contentType string, token string) (io.ReadCloser, error) {

	request.Header.Set("Content-Type", contentType)
	request.Header.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 ARMCNC/1.0.0")
	request.Header.Set("Account-Token", token)

	HttpClient := &http.Client{
		Timeout: 60 * time.Second,
	}

	response, err := HttpClient.Do(request)
	if err != nil {
		return nil, fmt.Errorf("error request: %w", err)
	}

	if response.StatusCode < 200 || response.StatusCode >= 400 {
		respBody, err := io.ReadAll(response.Body)
		if err != nil {
			return nil, err
		}
		return nil, fmt.Errorf("error request: %s", respBody)
	}

	return response.Body, nil
}
