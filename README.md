# unwrap-fisheye-image

Unwrap a circular fisheye, an upward fisheye, or a tiny-planet photo into a normal panoramic JPEG, entirely in the browser.

在瀏覽器入面，把圓形魚眼、望天魚眼或小行星圖展開成普通全景 JPEG。

- 中文 / Chinese: <https://rayony.github.io/unwrap-fisheye-image/>
- English: <https://rayony.github.io/unwrap-fisheye-image/en.html>

## How to use

1. Open either page above.
2. Optional: download a sample, then drop it on the page and pick the matching view.
   - [try-fisheye.jpg](try-fisheye.jpg) — side (looking forward)
   - [try-fisheye-bottom.jpg](try-fisheye-bottom.jpg) — bottom (looking up)
   - [try-fisheye-top.jpg](try-fisheye-top.jpg) — top (tiny planet)
3. Or drop your own JPEG or PNG.
4. Pick a view:
   - **Side (looking forward):** the centre is ahead. Crop the top and bottom of the circle. At 0% the whole circle is kept, then set height ÷ width.
   - **Bottom (looking up):** the centre is straight up. Crop the centre and set where the circle starts.
   - **Top (tiny planet / looking down):** the centre is straight down. Crop the planet centre and set the start angle.
5. Line the gold ring up with the round photo. The circle is not detected automatically.
   - **Center left–right** and **Center up–down:** 0% is the middle of the photo. Right and down are positive. You can also drag the cross on the original picture.
   - **Circle radius:** 100% touches the shorter side. Shrink it until the gold ring sits on the edge of the fisheye. A tiny planet with sky around it is usually under 100%. Moving the center does not change the radius.
   - **Start angle** (top and bottom only) chooses where the circle begins. 0° is the right side.
6. Tick **Flip left–right** if the result is mirrored.
7. On the result, drag the gold box or pull a handle. **Cut left / top / right / bottom** do the same thing. The dimmed part is left out.
8. Click **Save JPEG**. Only the box is saved.
9. Click **Copy parameters** to paste the same settings into `UnwrapFisheye.unwrap(image, params)`.

**Convert automatically after upload** is on by default. Turn it off to convert only when you click **Convert**.

(You can also download `index.html`, `en.html`, and `unwrap-fisheye.js` into the same folder and run them offline.)

## 點用

1. 打開上面任一頁。
2. 可以先下載樣本，再拖返頁面，並揀對應視角。
   - [try-fisheye.jpg](try-fisheye.jpg)：側面（望前）
   - [try-fisheye-bottom.jpg](try-fisheye-bottom.jpg)：底視（望天）
   - [try-fisheye-top.jpg](try-fisheye-top.jpg)：頂視（小行星）
3. 或者直接拖入你自己嘅 JPEG／PNG。
4. 揀視角：
   - **側面（望前）**：圓心係前方。可調上下裁切；0% 會保留成個圓，再揀高÷寬。
   - **底視（望天）**：圓心係正上方。可調圓心裁切同圓周起點。
   - **頂視（小行星／望下）**：圓心係正下方。可調行星圓心裁切同圓周起點。
5. 把金色圓對準魚眼圓。程式唔會自動估個圓。
   - **圓心左右**、**圓心上下**：0% 係張相正中。右同下係正數。亦可以喺原圖拖十字搬圓心。
   - **圓半徑**：100% 貼住較短邊。調到金圈貼住魚眼圓邊。外面仲有天空嘅小行星，多數要細過 100%。移動圓心唔會改變半徑。
   - **起點**（只有頂視同底視）決定圓周由邊度開始拆。0° 係圓嘅右面。
6. 需要時剔「左右反轉」。
7. 喺結果圖拖金框，或者拉角同邊。**結果左裁／上裁／右裁／下裁**係同一件事。變暗嘅部分唔會留。
8. 撳「儲存 JPEG」。只存框入面。
9. 撳「複製參數」，就可以用 `UnwrapFisheye.unwrap(image, params)` 重做同一張結果。

「上傳後自動展開」預設開住。取消之後，要自己撳「展開」先轉換。

(你亦可以下載 `index.html`、`en.html` 同 `unwrap-fisheye.js`，放喺同一個資料夾離線用。)

## Library / 程式庫

[unwrap-fisheye.js](unwrap-fisheye.js) is the same unwrap the page uses. No other library. Nothing is uploaded.

[unwrap-fisheye.js](unwrap-fisheye.js) 就係頁面用緊嘅同一套展開。唔使其他程式庫。圖片唔會上傳。

On the page, click **Copy parameters** / **複製參數**. Paste that into your own page, with the same image:

喺頁面撳「複製參數」，貼去你自己嘅頁，再用同一張圖：

```html
<script src="https://rayony.github.io/unwrap-fisheye-image/unwrap-fisheye.js"></script>
<script>
  const params = {
    view: "side",
    crop: 1,
    aspect: 1.58,
    start: 0,
    cx: 0,
    cy: 0,
    radius: 100,
    mirror: false,
    maxSide: 1800,
    trim: { left: 0, top: 0, right: 0, bottom: 0 }
  };
  const result = await UnwrapFisheye.unwrap(image, params);
  // result.canvas is the same picture as Save JPEG, including the crop.
  // Call unwrap from an async function. image can be an <img> or a canvas.
</script>
```

`image` can be an `<img>`, a canvas, or `ImageData`. `maxSide` defaults to 1800, the same shrink the page uses. `trim` is the result crop, in percent from each edge. `cx` / `cy` are percent from the middle of the photo; right and down are positive. `radius` 100 touches the shorter side.

`image` 可以係 `<img>`、canvas 或者 `ImageData`。`maxSide` 預設 1800，同頁面一樣先縮細。`trim` 係結果裁切，每邊幾多個百分比。`cx`／`cy` 係離相片中心嘅百分比，右同下係正數。`radius` 100 貼住較短邊。

## Privacy / 私隱

No image is uploaded to any server. Processing stays on your device, in the browser, using plain JavaScript only. No third-party library is used.

圖片唔會上傳到任何伺服器。所有處理都留喺你部裝置嘅瀏覽器入面，只用純 JavaScript，冇用任何外加程式庫。

## Files / 檔案

- `index.html` — Chinese page.
- `en.html` — English page. Same tool.
- `unwrap-fisheye.js` — library. Same result as the page, including the crop. / 程式庫，結果同頁面一樣，連裁切都一樣。
- `sample-fisheye.png` — diagram of the three views and the two crop settings.
- `try-fisheye.jpg` — side-view sample. `try-fisheye-bottom.jpg` — looking up. `try-fisheye-top.jpg` — tiny planet.
- 三張試用相：側面 `try-fisheye.jpg`、底視 `try-fisheye-bottom.jpg`、頂視 `try-fisheye-top.jpg`。

## How it works / 點樣拆

Imagine the round photo as a round window that squashed the view into a circle. The page spreads it back into a rectangle.

圓相好似一扇圓窗，把景色壓入一個圓。呢頁把個圓攤返做長方形。

### The golden circle / 金色圓

The page defaults the center of the circle to the center of the image.  User may adjust the center (the crossmark) and the area of the image / radius (golden circle) after loading the image.  Recommended to match the golden circle to the edge of the image before start the conversion.

頁面預設圓心等於圖片正中間，載入圖片後可自行調教圓心(十字)及圓形範圍/半徑(金圈)， 建議展開之前，先把金圈對準圓邊。

![三種視角 × 兩種裁切。紅色係預設剪走，金框係輸出形狀。 Red is the default crop. The gold box is the output shape.](sample-fisheye.png)

In each row the gold boxes share one width, so height shows the ratio. Side default crop 1% makes a picture about 3.5 times as tall as it is wide. At 0% the default height ÷ width is 1.58. Bottom default crop 3% makes a picture about 1.8 times as wide as it is tall. At 0% the default width ÷ height is 2.5. Top default crop 3% makes a picture about twice as wide as it is tall. At 0% the default width ÷ height is 2.2.

每一行金框用同一個闊度，高矮就係比例。側面預設裁 1%，高大約係闊嘅 3.5 倍；0% 預設高÷寬 1.58。底視預設裁圓心 3%，寬大約係高嘅 1.8 倍；0% 預設寬÷高 2.5。頂視預設裁圓心 3%，寬大約係高嘅 2 倍；0% 預設寬÷高 2.2。

### Side / 側面（望前）

The middle is looking straight ahead. Left and right are turning your head. Up and down are looking up or down.

圓心係望直前方。左右係轉頭，上下係望高望低。

### Bottom / 底視（望天）

The middle is the sky above you. The edge of the circle is the horizon. Going around the circle is turning your body all the way around, so the result is a long panorama.

圓心係頭頂嘅天。圓邊係地平線。沿住個圓行一圈，就係自己轉一個圈。

### Top / 頂視（小行星）

The middle is the ground under you. The round edge of the city is the horizon. The blue outside the circle is already sky.

圓心係腳下嘅地。城市圓邊係地平線。圓外面嘅藍色已經係天空。

### Crop more than 0% / 裁切大過 0%

We snip off the bit that would stretch the most, then unroll the rest like a poster on a tube. The further you look up or down, the taller that part must be drawn, so buildings look more natural. We stop before straight up or straight down, or the poster would be endlessly long.

Side view snips the top and bottom of the circle. Bottom view snips a small dot in the centre (the sky overhead). Top view snips a small dot in the planet centre (the ground under you), and leaves out sky more than 18° outside the circle.

剪走拉得最勁嗰截，再好似貼上圓筒咁攤平。愈望高或者愈望低，就要畫得愈高。唔去到正上或者正下，否則張紙會無限長。側面剪圓頂圓底。底視剪圓心一點天。頂視剪行星圓心一點地，圓外高過 18° 嘅天空都唔要。

### Crop at 0% / 裁切係 0%

The whole circle stays. The tube trick cannot include straight up or straight down, because that one direction would need an infinitely long poster. A gentler stretch is used instead: the middle still looks a bit like the tube, but it slows down near the edge so the whole circle fits. The slider chooses how tall or wide the poster is. The outer edge of the result is one point of the photo pulled into a line, so it looks smeared.

成個圓都留低。圓筒攤法去到正上或正下會要無限長嘅紙，所以改用溫和啲嘅拉法，去到邊就慢落嚟。滑桿揀張相幾高或者幾闊。最外嗰條邊其實只係一點被拉成一條線，所以會糊。

## License / 授權

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Commercial use and redistribution are allowed, including changes, if you credit **rayony** and the project **unwrap-fisheye-image**, link to the repository, and say what you changed.

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.zh-hant)。可以商用、可以再散佈，改咗都得。請註明名字 **rayony** 同專案 **unwrap-fisheye-image**，連去個 repo，同講明改過咩。

Suggested credit / 建議寫法：`unwrap-fisheye-image by rayony, CC BY 4.0`

