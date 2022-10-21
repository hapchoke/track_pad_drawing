# お絵描きサイト、ソフト
macのトラックパットで絵を描くことを想定したアプリケーションです。
押し込むと書きづらいという問題を解決するために、特定のキーボードを押している間は指を動かすだけで絵が描けます
# link
## web版
https://track-pad-drawing.harukifreedomein.tk/
## pcアプリ版
https://github.com/hapchoke/track-pad-drawing/out/make/zip/darwin/x64/track_pad_drawing-darwin-x64-1.0.0.zip
を解答することでpcのアプリとして使えます。
開発元が未確認なのでダブルクリックでは開けないはず、開く方法を2つ紹介
1 finderからアプリケーションアイコンを2本指でクリックまたはタップし、ショートカットメニューから開く
2 コードからアプリをパッケージ化する
    コード全体をcloneして、ターミナルでpackage.jsonと同階層に移動
    $npm install
    $npm run make
    できたtrack-pad-drawing/out/make/zip/darwin/x64/track_pad_drawing-darwin-x64-1.0.0.zipを解答するとアプリとして使える
# 機能一覧
- キーボード押し込みによる線画
- トラックパッド押し込みによる線画
- 線の太さの変更
- キャンバスサイズの変更
- 入力ようキーの変更
- パレットの使用
- 色の変更、スライダーとカラーピッカー
- 解説表示
- キャンバスの内容初期化
- キャンバスの内容のダウンロード
# 使用技術
html/css/javascript, aws s3/cloudfront/route53, electron/electron-forge
