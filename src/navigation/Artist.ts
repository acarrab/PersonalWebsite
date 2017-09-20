// create centralized drawer separate from actual canvas component file

export default class Artist {
    static getFadingGradient(canvas:HTMLCanvasElement, ctx:CanvasRenderingContext2D,initialColor:string):CanvasGradient {
        let w = canvas.width;
        let h = canvas.height;
        var gradient = ctx.createRadialGradient(w/2,h/2, 0, w/2, h/2, Math.min(w, h)/2);
        gradient.addColorStop(0, initialColor);
        gradient.addColorStop(.8, initialColor)
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        return gradient;
    }
}
