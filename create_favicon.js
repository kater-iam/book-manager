import favicons from "favicons";
import fs from "fs";
import path from "path";

const source = "./public/images/logo.png";
const outputFolder = "./public";  // 出力フォルダ

const configuration = {
    path: "/public",  // faviconの公開ディレクトリ
    appName: "My App",  // アプリケーション名
    appShortName: "App",  // アプリケーションの短縮名
    appDescription: "This is my application",  // アプリケーションの説明
    developerName: "Developer",  // 開発者名
    developerURL: null,  // 開発者のURL
    dir: "auto",  // テキストの方向
    lang: "en-US",  // 言語
    background: "#fff",  // 背景色
    theme_color: "#fff",  // テーマカラー
    appleStatusBarStyle: "black-translucent",  // Appleのステータスバーのスタイル
    display: "standalone",  // 表示モード
    orientation: "any",  // オリエンテーション
    scope: "/",  // スコープ
    start_url: "/?homescreen=1",  // 開始URL
    version: "1.0",  // バージョン
    logging: false,  // ログの有無
    pixel_art: false,  // ピクセルアートの有無
    loadManifestWithCredentials: false,  // 資格情報を使用してマニフェストをロードするかどうか
    icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        coast: false,
        favicons: true,
        windows: true,
        yandex: true
    }
};

favicons(source, configuration, (error, response) => {
    if (error) {
        console.error("Favicon generation error:", error.message);
        return;
    }

    // 画像ファイルを保存
    response.images.forEach(image => {
        fs.writeFileSync(path.join(outputFolder, image.name), image.contents);
    });

    // HTMLファイルとその他のファイルを保存
    response.files.forEach(file => {
        fs.writeFileSync(path.join(outputFolder, file.name), file.contents);
    });

    // HTMLタグをコンソールに出力
    console.log("HTML Tags:", response.html);
});

(() => {
    favicons(source, configuration, (error, response) => {
        console.log(response)
    })
})()

