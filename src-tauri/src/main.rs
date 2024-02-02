// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::CustomMenuItem;
use tauri::Manager;
use tauri::SystemTray;
use tauri::SystemTrayMenu;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[allow(unused)]
            use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial};

            let window = app
                .get_window("main")
                .expect("get the `main` window failed.");

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            #[cfg(target_os = "windows")]
            apply_blur(&window, Some((18, 18, 18, 125)))
                .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

            // 配置系统菜单
            let app_handle = app.handle();
            let tray_id = "my-tray";
            SystemTray::new()
                .with_id(tray_id)
                .with_menu(
                    SystemTrayMenu::new()
                        .add_item(CustomMenuItem::new("quit", "Quit"))
                        .add_item(CustomMenuItem::new("open", "Open")),
                )
                .on_event(move |_event| {
                    let _tray_handle = app_handle.tray_handle_by_id(tray_id).unwrap();
                })
                .build(app)?;

            Ok(())
        })
        .on_system_tray_event(|app, event| match event {
            tauri::SystemTrayEvent::MenuItemClick { id, .. } => {
                let window = app.get_window("main").expect("get the main window failed");
                if id == "open" {
                    let _ = window.show();
                } else if id == "quit" {
                    let _ = window.close();
                }
            }
            tauri::SystemTrayEvent::LeftClick { .. } => {
                let window = app.get_window("main").expect("get the main window failed");
                let _ = window.show();
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
