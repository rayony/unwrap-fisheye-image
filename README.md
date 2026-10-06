# unwrap-fisheye-image

Unwrap a circular fisheye, an upward fisheye, or a tiny-planet photo into a normal panoramic JPEG, entirely in the browser.

在瀏覽器入面，把圓形魚眼、望天魚眼或小行星圖展開成普通全景 JPEG。

- 中文 / Chinese: <https://rayony.github.io/unwrap-fisheye-image/>
- English: <https://rayony.github.io/unwrap-fisheye-image/en.html>

## How to use

1. Open either page above.
2. Drop or choose a JPEG or PNG.
3. Pick a view:
   - **Side (looking forward):** the centre is ahead. Crop the top and bottom of the circle. At 0% the whole circle is kept, then set height ÷ width.
   - **Bottom (looking up):** the centre is straight up. Crop the centre and set where the circle starts.
   - **Top (tiny planet / looking down):** the centre is straight down. Crop the planet centre and set the start angle.
4. Tick **Flip left–right** if the result is mirrored.
5. Click **Save JPEG**.

**Convert automatically after upload** is on by default. Turn it off to convert only when you click **Convert**.

## 點用

1. 打開上面任一頁。
2. 拖入或選擇一張 JPEG／PNG。
3. 揀視角：
   - **側面（望前）**：圓心係前方。可調上下裁切；0% 會保留成個圓，再揀高÷寬。
   - **底視（望天）**：圓心係正上方。可調圓心裁切同圓周起點。
   - **頂視（小行星／望下）**：圓心係正下方。可調行星圓心裁切同圓周起點。
4. 需要時剔「左右反轉」。
5. 撳「儲存 JPEG」。

「上傳後自動展開」預設開住。取消之後，要自己撳「展開」先轉換。

## Privacy / 私隱

No image is uploaded to any server. Processing stays on your device, in the browser, using plain JavaScript only. No third-party library is used.

圖片唔會上傳到任何伺服器。所有處理都留喺你部裝置嘅瀏覽器入面，只用純 JavaScript，冇用任何外加程式庫。

## Files / 檔案

- `index.html` — Chinese page. One file, works offline.
- `en.html` — English page. Same tool.
- 中文頁係 `index.html`，英文頁係 `en.html`。兩頁都係單檔，可離線打開。

## License

MIT
