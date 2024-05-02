import "./style.scss"

import { useEffect } from "react";
import config from "./config.json";
// eslint-disable-next-line
// @ts-ignore
import Quagga from "quagga";

export const Scanner = (props: any) => {
    const { onDetected } = props;

    useEffect(() => {
        Quagga.init(config, (err: any) => {
            if (err) {
                console.log(err, "error msg");
            }
            Quagga.start();
        });

        //detecting boxes on stream
        Quagga.onProcessed((result: any) => {
            const drawingCtx = Quagga.canvas.ctx.overlay
            const drawingCanvas = Quagga.canvas.dom.overlay

            if (result) {
                if (result.boxes) {
                    drawingCtx.clearRect(
                        0,
                        0,
                        Number(drawingCanvas.getAttribute("width")),
                        Number(drawingCanvas.getAttribute("height"))
                    );
                    result.boxes
                        .filter(function (box: any) {
                            return box !== result.box;
                        })
                        .forEach(function (box: any) {
                            Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                                color: "green",
                                lineWidth: 2
                            });
                        });
                }

                if (result.box) {
                    Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
                        color: "#00F",
                        lineWidth: 2
                    });
                }

                if (result.codeResult && result.codeResult.code) {
                    Quagga.ImageDebug.drawPath(
                        result.line,
                        { x: "x", y: "y" },
                        drawingCtx,
                        { color: "red", lineWidth: 3 }
                    );
                }
            }
        });

        Quagga.onDetected(detected);
        return () => {
            Quagga.stop()            
        }
        // eslint-disable-next-line
    }, []);

    const detected = (result: any) => {
        onDetected(result.codeResult.code);
    };

    return (
        <div id="interactive" className="viewport" />
    );
};

export default Scanner;
