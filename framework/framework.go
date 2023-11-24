/**
 ******************************************************************************
 * @file    framework.go
 * @author  ARMCNC site:www.armcnc.net github:armcnc.github.io
 ******************************************************************************
 */

package Framework

import (
	"cnc/framework/config"
	"cnc/framework/windows/start"
	"context"
	"embed"
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gookit/color"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/linux"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
	"net/http"
	"time"
)

func Init(template embed.FS, version embed.FS) {

	Config.Init(version)

	start := StartWindows.Init()

	httpService := &http.Server{
		Addr:           fmt.Sprintf(":%d", 20090),
		Handler:        Router(template),
		ReadTimeout:    60 * time.Second,
		WriteTimeout:   60 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	Config.Get.Group.Go(func() error {
		return httpService.ListenAndServe()
	})

	err := wails.Run(&options.App{
		Title:     "",
		Width:     1200,
		Height:    768,
		MinWidth:  1200,
		MinHeight: 768,
		AssetServer: &assetserver.Options{
			Assets: template,
		},
		BackgroundColour: &options.RGBA{R: 30, G: 31, B: 34, A: 1},
		OnStartup:        start.Startup,
		OnShutdown:       start.Shutdown,
		Bind: []interface{}{
			start,
		},
		WindowStartState: options.Maximised,
		Windows: &windows.Options{
			WebviewDisableRendererCodeIntegrity: true,
			DisableWindowIcon:                   true,
			CustomTheme: &windows.ThemeSettings{
				// 黑色主题
				DarkModeTitleBar:  windows.RGB(43, 45, 48),
				DarkModeTitleText: windows.RGB(187, 187, 187),
				DarkModeBorder:    windows.RGB(60, 63, 65),
				// 亮色主题
				LightModeTitleBar:  windows.RGB(43, 45, 48),
				LightModeTitleText: windows.RGB(187, 187, 187),
				LightModeBorder:    windows.RGB(60, 63, 65),
				// 黑色主题失去焦点时
				DarkModeTitleBarInactive:  windows.RGB(60, 63, 65),
				DarkModeTitleTextInactive: windows.RGB(187, 187, 187),
				DarkModeBorderInactive:    windows.RGB(60, 63, 65),
				// 亮色主题失去焦点时
				LightModeTitleBarInactive:  windows.RGB(60, 63, 65),
				LightModeTitleTextInactive: windows.RGB(187, 187, 187),
				LightModeBorderInactive:    windows.RGB(60, 63, 65),
			},
		},
		Linux: &linux.Options{
			Icon:                []byte(""),
			WindowIsTranslucent: false,
			WebviewGpuPolicy:    linux.WebviewGpuPolicyNever,
		},
		Debug: options.Debug{
			OpenInspectorOnStartup: false,
		},
	})

	if err != nil {
		fmt.Println("[cnc][framework]：" + color.Gray.Text(err.Error()))
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := httpService.Shutdown(ctx); err != nil {
	}

	if err := Config.Get.Group.Wait(); err != nil {
	}

	fmt.Println("[cnc][http]：ListenAndServe")
}

func Router(template embed.FS) http.Handler {

	router := gin.Default()

	router.Use(gin.Recovery())

	router.Use(cors.Default())

	router.Static("/", "template/dist")

	return router
}
