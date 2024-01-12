//import React from 'react';
import * as React from 'react';

  class ClockMub extends React.Component<ClockProps, any> {
    render() {
      return (
        <div>
          <Clock size={this.props.size} timeFormat={this.props.timeFormat} hourFormat={this.props.hourFormat} />
        </div>
      );
    }
  }
  //<Clock size={this.props.clockSize} timeFormat="24hour" hourFormat="standard" />

  type ClockProps = { 
      //message: string; // using `interface` is also ok
      size: number;
      timeFormat: string;
      hourFormat: string;

  };
  type ClockState = {
      count: number; // STATE like this
      time: Date;
  };


  class Clock extends React.Component<ClockProps, any> {
     //declaration of fields and methods in a class Clock (TypeScript language)
     color: string = "blue";
     radius: number = 0;
     drawingContext: any = null;
     draw24hour: boolean;
     drawRoman: boolean;
     timerId: any;

     constructor(props: ClockProps) {
        super(props);
  
        this.state = {
         count: 0,
         time: new Date(), 
        };

        this.radius = this.props.size / 2;
        this.drawingContext = null;
        this.draw24hour = this.props.timeFormat.toLowerCase().trim() === "24hour";
        this.drawRoman = !this.draw24hour && this.props.hourFormat.toLowerCase().trim() === "roman";
     }
  
     componentDidMount() {
        this.getDrawingContext();
        this.timerId = setInterval(() => this.tick(), 1000);
     }
  
     componentWillUnmount() {
        clearInterval(this.timerId);
     }
  
     getDrawingContext() {
      let canv: HTMLCanvasElement = this.refs.clockCanvas as HTMLCanvasElement;
      this.drawingContext = canv.getContext('2d');
      //this.drawingContext = this.refs.clockCanvas.getContext('2d'); Error - not precise in js. It is not [HTMLElement] type
      //https://howtojs.io/how-to-solve-property-getcontext-does-not-exist-on-type-htmlelement-error-in-angular-12-typescript/
        this.drawingContext.translate(this.radius, this.radius);
        this.radius *= 0.9;
     }
  
     tick() {
        this.setState({ time: new Date() });
        const radius = this.radius;
        let ctx = this.drawingContext;
        this.drawFace(ctx, radius);
        this.drawNumbers(ctx, radius);
        this.drawTicks(ctx, radius);
        this.drawTime(ctx, radius);
     }
  
     drawFace(ctx:any, radius:any): void {
        ctx.beginPath();
        ctx.arc(0,0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
  
        const grad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
        grad.addColorStop(0, "#333");
        grad.addColorStop(0.5, "white");
        grad.addColorStop(1, "#999");
        ctx.strokeStyle = grad;
        ctx.lineWidth = radius * 0.075;
        ctx.stroke();
  
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.05, 0, 2 * Math.PI);
        ctx.fillStyle = "#333";
        ctx.fill();
     }
  
     drawNumbers(ctx:any, radius:any): void {
        const romans = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
        const fontBig = radius * 0.15 + "px Arial";
        const fontSmall = radius * 0.1 + "px Arial";
        let ang, num;
  
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        const moveBigNum = 0.78;
        const moveSmallNum = 0.62;
        for (num = 1; num < 13; num++) {
           ang = num * Math.PI / 6;
           ctx.rotate(ang);
           ctx.translate(0, -radius * moveBigNum);
           ctx.rotate(-ang);
           ctx.font = fontBig;
           ctx.fillStyle = "black";
           ctx.fillText(this.drawRoman ? romans[num-1] : num.toString(), 0, 0);
           ctx.rotate(ang);
           ctx.translate(0, radius * moveBigNum);
           ctx.rotate(-ang);
  
           // Draw inner numerals for 24 hour time format
           if (this.draw24hour) {
              ctx.rotate(ang);
              ctx.translate(0, -radius * moveSmallNum);
              ctx.rotate(-ang);
              ctx.font = fontSmall;
              ctx.fillStyle = "#a1b4d6";// "blue"; //"red";
              ctx.fillText((num + 12).toString(), 0, 0);
              ctx.rotate(ang);
              ctx.translate(0, radius * moveSmallNum);
              ctx.rotate(-ang);
           }
        }
  
        ctx.font = fontSmall;
        ctx.fillStyle = "#999";
        ctx.translate(0, radius * 0.30);
        ctx.fillText("AlanMunson", 0, -10);
        ctx.translate(0, -radius * 0.30);
     }
  
     drawTicks(ctx:any, radius:any): void {
        let numTicks, tickAng, tickX, tickY;
  
        for (numTicks = 0; numTicks < 60; numTicks++) {
  
           tickAng = (numTicks * Math.PI / 30);
           tickX = radius * Math.sin(tickAng);
           tickY = -radius * Math.cos(tickAng);
  
           ctx.beginPath();
           ctx.lineWidth = radius * 0.010;
           ctx.moveTo(tickX, tickY);
           if (numTicks % 5 === 0) {
              ctx.lineTo(tickX * 0.88, tickY * 0.88);
           } else {
              ctx.lineTo(tickX * 0.92, tickY * 0.92);
           }
           ctx.stroke();
        }
     }
  
     drawTime(ctx:any, radius:any): void {
        const now = this.state.time;
        let hour = now.getHours();
        let minute = now.getMinutes();
        let second = now.getSeconds();
  
        let jsTimeDigital = "" + this.jpad(hour,2) + ":"+ this.jpad(minute,2)+ ":"+ this.jpad(second,2)

        // hour
        hour %= 12;
        hour = (hour * Math.PI / 6) + (minute * Math.PI / (6 * 60)) + (second * Math.PI / (360 * 60));
        this.drawHand(ctx, hour, radius * 0.55, radius * 0.05, "black");
        // minute
        minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
        this.drawHand(ctx, minute, radius * 0.82, radius * 0.05, "black");
        // second
        second = (second * Math.PI / 30);
        this.drawHand(ctx, second, radius * 0.9, radius * 0.02, "red");

        this.drawDigitalClock(ctx, radius, jsTimeDigital);
      }

      drawDigitalClock(ctx:any, radius:any, xsTimeDigital: string) {
        const fontSmall = radius * 0.2 + "px Arial";
        const iMoveDigital = -radius * 0.18;
        const iWidth = radius * 0.82;
        const iHeight = radius * 0.2;
         ctx.font = fontSmall;

         ctx.translate(0, iMoveDigital);

         ctx.rect(-iWidth*0.5, iMoveDigital*0.6, iWidth, iHeight);
         ctx.fillStyle = "#DDD";
         ctx.fill();

         ctx.fillStyle = "#3e08a9";
         ctx.fillText(xsTimeDigital, 0, 0);

         ctx.translate(0, -iMoveDigital);
      }

      jpad(num:number, size:number) {
         var s = "0000" + num;
         return s.substr(s.length-size);
      }

     drawHand(ctx: any, position:number, length:number, width:number, color: any) {
        color = color || "black";
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.moveTo(0, 0);
        ctx.rotate(position);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-position);
     }
  
     render() {
        return (
           <div className="Clock" style={{ width: String(this.props.size) + 'px' }}>
              <canvas width={this.props.size} height={this.props.size} ref="clockCanvas"/>
           </div>
        );
     }
  }
  
export default ClockMub;
