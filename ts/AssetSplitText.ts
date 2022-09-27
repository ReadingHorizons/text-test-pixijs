/// <reference path="../typings/gsap/index.d.ts"/>
/// <reference path="../typings/pixi.js/index.d.ts"/>

class AssetSplitText extends PIXI.Container
{
    //--------------------------------------------------------------------------
    //
    //  Properties
    //
    //--------------------------------------------------------------------------

    //----------------------------------
    //  Public:
    //----------------------------------

    public kerning:number;             //Space between characters
    public leading:number;              //Space between lines

    //----------------------------------
    //  Private:
    //----------------------------------

    private _textStyle:PIXI.TextStyle;
    private chars:string[];
    private initialColor:number;
    private text:string;
    private textFields:PIXI.Text[];

    //--------------------------------------------------------------------------
    //
    //  Getters/Setters
    //
    //--------------------------------------------------------------------------

    public get textStyle():PIXI.TextStyle
    {
        return this._textStyle;
    }

    public set textStyle(value:PIXI.TextStyle)
    {
        this._textStyle = value;
        this.initialColor = parseInt(String(value.fill));
    }

    //--------------------------------------------------------------------------
    //
    //  Constructor
    //
    //--------------------------------------------------------------------------

    constructor(text:string)
    {
        super();
        this.text = text;
        this._init();
    }

    //--------------------------------------------------------------------------
    //
    //  Methods
    //
    //--------------------------------------------------------------------------

    //----------------------------------
    //  Private:
    //----------------------------------

    private _init():void
    {
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

    private createTextFields():void
    {
        this.textFields = [];
        let curMetrics;
        let curText;
        let curX = 0;
        let len = this.chars.length;
        for(let i=0; i<len; i++)
        {
            curText = new PIXI.Text(this.chars[i], this.textStyle);
            curText.x = curX;
            curMetrics = PIXI.TextMetrics.measureText(this.chars[i], this.textStyle);
            //debugger;
            curX += curMetrics.width+this.kerning;
            this.addChild(curText);
            this.textFields.push(curText);
        }
    }

    private exractAllIndices():number[]
    {
        return this.extractIndices("0-"+(this.text.length-1).toString());
    }

    private extractIndices(value:string):number[]
    {
        let indices = [];
        if(value.indexOf(",") > 0)
        {
            indices = value.split(",");
            indices = indices.map(val => Number(val));
        }
        else if(value.indexOf("-") > 0)
        {
            let start = Number(value.substring(0, value.indexOf("-")));
            let end = Number(value.substring(value.indexOf("-")+1));
            for(let i:number=start; i<=end; i++)
            {
                indices.push(i);
            }
        }
        else
        {
            indices.push(Number(value));
        }

        return indices;
    }

    //----------------------------------
    //  Public:
    //----------------------------------

    public create():void
    {
        this.createTextFields();
    }

    public decode():void
    {
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
        gsap.to(mark, {x:this.textFields[1].x+this.textFields[1].width/2, duration:1});
    }

    public fade(indices?:string, duration = 1):void
    {
        let fadeIndices: number[];
        if(indices == undefined || indices == null)
        {
            fadeIndices = this.exractAllIndices();
        }
        else
        {
            fadeIndices = this.extractIndices(indices);
        }
        const len = fadeIndices.length;
        for(let i:number=0; i<len; i++)
        {
            gsap.to(this.textFields[fadeIndices[i]], {alpha:0, duration:duration});
        }
    }

    public highlight(indices?:string, color:number=0x00FF00):void
    {
        let curTextField:PIXI.Text;
        let highlightIndices: number[];
        let highlightStyle = this._textStyle.clone();
        highlightStyle.fill = color;
        if(indices == undefined || indices == null)
        {
            highlightIndices = this.exractAllIndices();
        }
        else
        {
            highlightIndices = this.extractIndices(indices);
        }
        const len = highlightIndices.length;
        for(let i:number=0; i<len; i++)
        {
            curTextField = new PIXI.Text(this.chars[highlightIndices[i]], highlightStyle);
            curTextField.x = this.textFields[highlightIndices[i]].x;
            this.addChild(curTextField);
            this.textFields[highlightIndices[i]].destroy();
            this.textFields[highlightIndices[i]] = curTextField;
        }
    }

}
