import { IImageDetails } from '../Entities/IUIEntities';

export default class ImageHelpers {

    static BytearrayBufferToBase64 = (buffer: any): string => {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    static Base64ToByteArrayBuffer = (base64: string): any => {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    static GetBlankImageInformation = (): IImageDetails => {
        let img: IImageDetails = {
            CustomBase64: "",
            Extension: "",
            RealBase64: "",
            SizeInByte: 0,
            SizeInKB: 0,
            Type: "",
            SizeInMB: 0,
            ByteArray: undefined,
            Prefix: "",
            File: undefined // 18-01-2024
        };
        return img;
    }

    static GetImageInformation = (file: any): IImageDetails => {

        let img: IImageDetails = {
            ...ImageHelpers.GetBlankImageInformation()
        };

        var reader = new FileReader();
        reader.onload = (event: any) => {

            console.log(event.target.result.toString());

            let _realbase64: string = event.target.result.toString();
            let _custombase64Array: string[] = _realbase64.split('base64,');
            let _custombase64: string = _custombase64Array[1];
            let _prefix: string = _custombase64Array[0] + 'base64,';
            let _byteArray: any = ImageHelpers.Base64ToByteArrayBuffer(_custombase64);
            img = {
                RealBase64: _realbase64,
                CustomBase64: _custombase64,
                Extension: file.type.split('/')[1],
                SizeInByte: file.size,
                SizeInKB: file.size / 1024,
                SizeInMB: (file.size / 1024) / 1024,
                Type: file.type,
                ByteArray: _byteArray,
                Prefix: _prefix,
                File: file  // 18-01-2024
            }
        }

        reader.readAsDataURL(file);
        return img;
    }
}