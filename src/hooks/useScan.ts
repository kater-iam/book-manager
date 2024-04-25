// @ts-ignore
import Quagga from 'quagga'
import { useEffect, useState } from 'react'

export const useScan = () => {
    const [barcode, setBarcode] = useState<string | null>(null)
    const [ref, setRef] = useState<any>(null)

    useEffect(() => {
        if (!ref) return
        console.log('load')
        isbnLoad()
    }, [ref])

    function isbnLoad() {
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: ref?.current
            },
            decoder: {
                readers: ["code_128_reader"]
            }
        }, function (err: any) {
            if (err) {
                console.log(err);
                return
            }
            console.log("Initialization finished. Ready to start");
            Quagga.start();
        })

    }

    return {
        barcode,
        setRef,
        isbnLoad
    }
}
