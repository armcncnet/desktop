/**
 ******************************************************************************
 * @file    config.go
 * @author  ARMCNC site:www.armcnc.net github:armcnc.github.io
 ******************************************************************************
 */

package Config

import (
	"embed"
	"encoding/json"
	"golang.org/x/sync/errgroup"
)

var Get = &Data{}

type Data struct {
	Info struct {
		CompanyName    string `json:"companyName"`
		ProductName    string `json:"productName"`
		ProductVersion string `json:"productVersion"`
	} `json:"info"`
	Group errgroup.Group
}

func Init(version embed.FS) {
	wails, _ := version.ReadFile("wails.json")
	var wailsJson Data
	json.Unmarshal(wails, &wailsJson)
	Get.Info.ProductVersion = wailsJson.Info.ProductVersion
	Get.Info.ProductName = wailsJson.Info.ProductName
	Get.Info.CompanyName = wailsJson.Info.CompanyName
}
