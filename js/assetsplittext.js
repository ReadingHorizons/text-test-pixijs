class AssetSplitText extends PIXI.Container {
    constructor(text) {
        super();
        this.text = text;
        this._init();
    }
    get textStyle() {
        return this._textStyle;
    }
    set textStyle(value) {
        this._textStyle = value;
        this.initialColor = parseInt(String(value.fill));
    }
    _init() {
        this.initialColor = 0x000000;
        this.chars = this.text.split("");
        this.kerning = 0;
        this.leading = 0;
        this.textStyle = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 48,
            fill: this.initialColor
        });
    }
    createTextFields() {
        this.textFields = [];
        let curMetrics;
        let curText;
        let curX = 0;
        let len = this.chars.length;
        for (let i = 0; i < len; i++) {
            curText = new PIXI.Text(this.chars[i], this.textStyle);
            curText.x = curX;
            curMetrics = PIXI.TextMetrics.measureText(this.chars[i], this.textStyle);
            curX += curMetrics.width + this.kerning;
            this.addChild(curText);
            this.textFields.push(curText);
        }
    }
    exractAllIndices() {
        return this.extractIndices("0-" + (this.text.length - 1).toString());
    }
    extractIndices(value) {
        let indices = [];
        if (value.indexOf(",") > 0) {
            indices = value.split(",");
            indices = indices.map(val => Number(val));
        }
        else if (value.indexOf("-") > 0) {
            let start = Number(value.substring(0, value.indexOf("-")));
            let end = Number(value.substring(value.indexOf("-") + 1));
            for (let i = start; i <= end; i++) {
                indices.push(i);
            }
        }
        else {
            indices.push(Number(value));
        }
        return indices;
    }
    create() {
        this.createTextFields();
    }
    decode() {
        var size = 14;
        let mark = new PIXI.Graphics();
        mark.lineStyle(3);
        mark.moveTo(0, 0);
        mark.lineTo(size, size);
        mark.moveTo(size, 0);
        mark.lineTo(0, size);
        mark.pivot = new PIXI.Point(7, 7);
        mark.x = -20;
        mark.y = 125;
        this.addChild(mark);
        gsap.to(mark, { x: this.textFields[1].x + this.textFields[1].width / 2, duration: 1 });
    }
    fade(indices, duration = 1) {
        let fadeIndices;
        if (indices == undefined || indices == null) {
            fadeIndices = this.exractAllIndices();
        }
        else {
            fadeIndices = this.extractIndices(indices);
        }
        const len = fadeIndices.length;
        for (let i = 0; i < len; i++) {
            gsap.to(this.textFields[fadeIndices[i]], { alpha: 0, duration: duration });
        }
    }
    highlight(indices, color = 0x00FF00) {
        let curTextField;
        let highlightIndices;
        let highlightStyle = this._textStyle.clone();
        highlightStyle.fill = color;
        if (indices == undefined || indices == null) {
            highlightIndices = this.exractAllIndices();
        }
        else {
            highlightIndices = this.extractIndices(indices);
        }
        const len = highlightIndices.length;
        for (let i = 0; i < len; i++) {
            curTextField = new PIXI.Text(this.chars[highlightIndices[i]], highlightStyle);
            curTextField.x = this.textFields[highlightIndices[i]].x;
            this.addChild(curTextField);
            this.textFields[highlightIndices[i]].destroy();
            this.textFields[highlightIndices[i]] = curTextField;
        }
    }
}
//# sourceMappingURL=assetsplittext.js.map