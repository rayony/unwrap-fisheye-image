# unwrap-fisheye-image

把圓形魚眼、望天魚眼、小行星圖，喺瀏覽器入面展開成普通全景 JPEG。

Live page: <https://rayony.github.io/unwrap-fisheye-image/>

## 點用

1. 打開上面嘅頁面。
2. 拖入或選擇一張 JPEG／PNG。
3. 揀視角：
   - **側面（望前）**：圓心係前方。可調上下裁切；0% 會保留成個圓，再揀高÷寬。
   - **底視（望天）**：圓心係正上方。可調圓心裁切同圓周起點。
   - **頂視（小行星／望下）**：圓心係正下方。可調行星圓心裁切同圓周起點。
4. 需要時剔「左右反轉」。
5. 撳「儲存 JPEG」。

「上傳後自動展開」預設開住。取消之後，要自己撳「展開」。

## 私隱

圖片唔會上傳到任何伺服器。所有處理都留喺你部裝置嘅瀏覽器入面，只用純 JavaScript，冇用任何外加程式庫。

No image is uploaded to any server. Processing stays local in the browser, in plain JavaScript only. No third-party library is used.

## 檔案

- `index.html`：成個工具，單檔，可離線打開。

## License

MIT
