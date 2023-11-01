var w = [], y = [], z = [];
const pwd = "hola";


function cifrar()
{
    var imgEntrada = document.getElementById('BotonImg');
    const canvas = document.getElementById('Canvas');
    const dosD = canvas.getContext('2d');
    const colores = document.getElementById('color');

    imgEntrada.addEventListener('change', () => {

        const archivo = imgEntrada.files[0];
        const lectura = new FileReader();

        var x = 0;

        console.log("hola");

        lectura.onload = (event) => 
        {

            const imgBMP = new Image();
            imgBMP.src = event.target.result;

            console.log("hola");

            imgBMP.onload = () =>
            {
                canvas.width = imgBMP.width;
                canvas.height = imgBMP.height;
                dosD.drawImage(imgBMP,0,0);

                const datosImagen = dosD.getImageData(0,0,imgBMP.width,imgBMP.height);
                const pixels = datosImagen.data;
                
                const rgbInput = document.getElementById('color');
                rgbInput.innerHTML = '';

                const modo = document.getElementById('modoDecEnc').value;

                console.log(modo);

                if(modo === "ECB");
                {
                    cifradorECB(pixels, rgbInput, x, imgBMP, canvas);
                }

                if (modo === "OFB") {
                    cifradorOFB(pixels, rgbInput, x, imgBMP, canvas);
                }

                if (modo === "CBC") {
                    cifradorCBC(pixels, rgbInput, x, imgBMP, canvas);
                }

                if (modo === "CFB") {
                    cifradorCFB(pixels, rgbInput, x, imgBMP, canvas);
                }

            };          
        };

        lectura.readAsDataURL(archivo);

    });
}

function descifrar()
{
    var imgEntrada = document.getElementById('BotonImg');
    const canvas = document.getElementById('Canvas');
    const dosD = canvas.getContext('2d');
    const colores = document.getElementById('color');

    imgEntrada.addEventListener('change', () => {

        const archivo = imgEntrada.files[0];
        const lectura = new FileReader();

        var x = 0;

        console.log("hola");

        lectura.onload = (event) => 
        {

            const imgBMP = new Image();
            imgBMP.src = event.target.result;

            console.log("hola");

            imgBMP.onload = () =>
            {
                canvas.width = imgBMP.width;
                canvas.height = imgBMP.height;
                dosD.drawImage(imgBMP,0,0);

                const datosImagen = dosD.getImageData(0,0,imgBMP.width,imgBMP.height);
                const pixels = datosImagen.data;
                
                const rgbInput = document.getElementById('color');
                rgbInput.innerHTML = '';

                const modo = document.getElementById('modoDecEnc').value;

                console.log(modo);

                if(modo === "ECB");
                {
                    descifradorECB(pixels, rgbInput, x, imgBMP, canvas);
                }

                if (modo === "OFB") {
                    descifradorOFB(pixels, rgbInput, x, imgBMP, canvas);
                }

                if (modo === "CBC") {
                    descifradorCBC(pixels, rgbInput, x, imgBMP, canvas);
                }

                if (modo === "CFB") {
                    descifradorCFB(pixels, rgbInput, x, imgBMP, canvas);
                }

            };          
        };

        lectura.readAsDataURL(archivo);

    });
}

function descifradorECB(pixels, rgbInput, x, imgBMP, canvas) {
    for (let i = 0; i < pixels.length; i += 4) {
        var r = pixels[i];
        var g = pixels[i + 1];
        var b = pixels[i + 2];

        const conjunto = [r, g, b];

        for (let j = 0; j < conjunto.length; j++) {
            var aux = conjunto[j].toString();
            var descifrado = CryptoJS.AES.decrypt(aux, pwd);

            w[x] = parseInt(descifrado.toString(CryptoJS.enc.Hex), 16);
            x++;
        }
    }

    const canvasDos = document.getElementById('Canvas2');
    const ctxNuevo = canvasDos.getContext('2d');
    canvasDos.width = imgBMP.width;
    canvasDos.height = imgBMP.height;

    x = 0;
    var i = 0;
    var j = 0;

    for (i = 0; i < canvasDos.height; i++) {
        for (j = 0; j < canvasDos.width; j++) {
            var r = w[x];
            var g = y[x];
            var b = z[x];

            ctxNuevo.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctxNuevo.fillRect(j, i, 1, 1);
            x++;
        }
    }

    const canvasURL = canvasDos.toDataURL('image/bmp');
    var download = document.createElement('a');
    download.href = canvasURL;
    download.download = "img_d.bmp";
    download.click();
}

function descifradorCFB(pixels, rgbInput, x, imgBMP, canvas) {
    for (let i = 0; i < pixels.length; i += 4) {
        var r = pixels[i];
        var g = pixels[i + 1];
        var b = pixels[i + 2];

        const conjunto = [r, g, b];

        for (let j = 0; j < conjunto.length; j++) {
            // Descifrar el IV para generar la secuencia de retroalimentación
            var auxIV = iv.words[j] ^ w[x - 3];
            var cifIV = CryptoJS.AES.encrypt(auxIV.toString(16), pwd);
            var retroalimentacion = cifIV.toString(CryptoJS.format.Hex);

            // Realizar una operación XOR con la secuencia de retroalimentación
            var aux = (conjunto[j] ^ retroalimentacion).toString(16);
            var descifrado = CryptoJS.AES.decrypt(aux, pwd);

            var descifradoDecimal = parseInt(descifrado.toString(CryptoJS.enc.Hex), 16);
            w[x] = descifradoDecimal;

            x++;
        }
    }

    const canvasDos = document.getElementById('Canvas2');
    const ctxNuevo = canvasDos.getContext('2d');
    canvasDos.width = imgBMP.width;
    canvasDos.height = imgBMP.height;

    x = 0;
    var i = 0;
    var j = 0;

    for (i = 0; i < canvasDos.height; i++) {
        for (j = 0; j < canvasDos.width; j++) {
            var r = w[x];
            var g = y[x];
            var b = z[x];

            ctxNuevo.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctxNuevo.fillRect(j, i, 1, 1);
            x++;
        }
    }

    const canvasURL = canvasDos.toDataURL('image/bmp');
    var download = document.createElement('a');
    download.href = canvasURL;
    download.download = "img_d.bmp";
    download.click();
}

function descifradorOFB(pixels, rgbInput, x, imgBMP, canvas) {
    for (let i = 0; i < pixels.length; i += 4) {
        var r = pixels[i];
        var g = pixels[i + 1];
        var b = pixels[i + 2];

        const conjunto = [r, g, b];

        for (let j = 0; j < conjunto.length; j++) {
            var aux = conjunto[j].toString();
            var cif = CryptoJS.AES.encrypt(aux, pwd);
            var auxCifrado = cif.toString(CryptoJS.format.Hex);

            // Realizar una operación XOR con el cifrado para obtener el texto plano original
            w[x] = (parseInt(auxCifrado, 16) % 255) ^ conjunto[j];

            x++;
        }
    }

    const canvasDos = document.getElementById('Canvas2');
    const ctxNuevo = canvasDos.getContext('2d');
    canvasDos.width = imgBMP.width;
    canvasDos.height = imgBMP.height;

    x = 0;
    var i = 0;
    var j = 0;

    for (i = 0; i < canvasDos.height; i++) {
        for (j = 0; j < canvasDos.width; j++) {
            var r = w[x];
            var g = y[x];
            var b = z[x];

            ctxNuevo.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctxNuevo.fillRect(j, i, 1, 1);
            x++;
        }
    }

    const canvasURL = canvasDos.toDataURL('image/bmp');
    var download = document.createElement('a');
    download.href = canvasURL;
    download.download = "img_d.bmp";
    download.click();
}

function descifradorCBC(pixels, rgbInput, x, imgBMP, canvas) {
    for (let i = 0; i < pixels.length; i += 4) {
        var r = pixels[i];
        var g = pixels[i + 1];
        var b = pixels[i + 2];

        const conjunto = [r, g, b];

        for (let j = 0; j < conjunto.length; j++) {
            var aux = conjunto[j].toString();
            var descifrado = CryptoJS.AES.decrypt(aux, pwd);

            // Realizar una operación XOR con el bloque cifrado anterior (o IV en el primer bloque)
            if (x === 0) {
                w[x] = descifrado.toString(CryptoJS.enc.Hex) ^ iv.words[j];
            } else {
                w[x] = descifrado.toString(CryptoJS.enc.Hex) ^ w[x - 3];
            }

            x++;
        }
    }

    const canvasDos = document.getElementById('Canvas2');
    const ctxNuevo = canvasDos.getContext('2d');
    canvasDos.width = imgBMP.width;
    canvasDos.height = imgBMP.height;

    x = 0;
    var i = 0;
    var j = 0;

    for (i = 0; i < canvasDos.height; i++) {
        for (j = 0; j < canvasDos.width; j++) {
            var r = w[x];
            var g = y[x];
            var b = z[x];

            ctxNuevo.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctxNuevo.fillRect(j, i, 1, 1);
            x++;
        }
    }

    const canvasURL = canvasDos.toDataURL('image/bmp');
    var download = document.createElement('a');
    download.href = canvasURL;
    download.download = "img_d.bmp";
    download.click();
}

// CIFRADORES


// function cifradorECB(pixels, rgbInput, x, imgBMP, canvas)
// {
//     for(let i = 0; i < pixels.length ; i += 4){

//         var r = pixels[i];
//         var g = pixels[i+1];
//         var b = pixels[i+2];

//         console.log(pixels[i], pixels[i+1], pixels[i+2]);

//         const rgbTexto = document.createElement('div');
//         rgbTexto.textContent = `RGB: (${r}, ${g}, ${b})`;

//         const conjunto = [r,g,b];

//         const muestraResultado = document.createElement('div');
//         muestraResultado.textContent = `RGB: ${conjunto}`;
//         rgbInput.appendChild(muestraResultado);

//         console.log("hola");

//         for(let j = 0; j < conjunto.length; j += 4)
//         {
//             var aux = conjunto[0].toString();
//             var cif = CryptoJS.AES.encrypt(aux, pwd);
//             aux = cif.toString(CryptoJS.format.Hex);
//             w[x] = (parseInt(aux, 16)%255);
            
//             aux = conjunto[1].toString();
//             cif = CryptoJS.AES.encrypt(aux, pwd);
//             aux = cif.toString(CryptoJS.format.Hex);
//             y[x] = (parseInt(aux, 16)%255);

//             aux = conjunto[2].toString();
//             cif = CryptoJS.AES.encrypt(aux, pwd);
//             aux = cif.toString(CryptoJS.format.Hex);
//             z[x] = (parseInt(aux, 16)%255);

//             console.log(w[x], y[x], z[x]);

//             x ++;

//             var rgbSuma = document.createElement('div');
//             rgbSuma.textContent = `SUMA RGB: (${conjunto[0]}, ${conjunto[1]}, ${conjunto[2]})`
//             rgbInput.appendChild(rgbSuma);
//         }    
//     }


//     const canvasDos = document.getElementById('Canvas2');
//     const ctxNuevo = canvasDos.getContext('2d');
    
//     canvasDos.width = imgBMP.width;
//     canvasDos.height = imgBMP.height;

//     x = 0;
//     var i = 0;
//     var j = 0;

//     for(i = 0; i < canvasDos.height; i++){

//         for(j = 0; j < canvasDos.width; j++)
//         {
//             var r = w[x];
//             var g = y[x];
//             var b = z[x];

//             ctxNuevo.fillRect(j,i,canvasDos.height, canvasDos.width);
//             ctxNuevo.fillStyle = `rgb(${r}, ${g}, ${b})`;

//             x++;
//         }
//     }

//     const canvasURL = canvasDos.toDataURL('image/bmp');
//     var download = document.createElement('a');

//     download.href = canvasURL;
//     download.download = "img_c.bmp";

//     download.click();

// }

function cifradorECB(pixels, rgbInput, x, imgBMP, canvas) {
    for (let i = 0; i < pixels.length; i += 4) {
        var r = pixels[i];
        var g = pixels[i + 1];
        var b = pixels[i + 2];

        const conjunto = [r, g, b];

        for (let j = 0; j < conjunto.length; j++) {
            var aux = conjunto[j].toString();
            var cifrado = CryptoJS.AES.encrypt(aux, pwd);

            // Obtener el texto cifrado en formato hexadecimal
            var cifradoHex = cifrado.ciphertext.toString();

            // Convertir el texto cifrado hexadecimal a un valor decimal
            w[x] = parseInt(cifradoHex, 16) % 255;

            x++;
        }
    }

    const canvasDos = document.getElementById('Canvas2');
    const ctxNuevo = canvasDos.getContext('2d');
    canvasDos.width = imgBMP.width;
    canvasDos.height = imgBMP.height;

    x = 0;
    var i = 0;
    var j = 0;

    for (i = 0; i < canvasDos.height; i++) {
        for (j = 0; j < canvasDos.width; j++) {
            var r = w[x];
            var g = y[x];
            var b = z[x];

            ctxNuevo.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctxNuevo.fillRect(j, i, 1, 1);
            x++;
        }
    }

    const canvasURL = canvasDos.toDataURL('image/bmp');
    var download = document.createElement('a');
    download.href = canvasURL;
    download.download = "img_c_ecb.bmp";
    download.click();
}



function cifradorOFB(pixels, rgbInput, x, imgBMP, canvas) {
    console.log("OFB");
    for (let i = 0; i < pixels.length; i += 4) {
        var r = pixels[i];
        var g = pixels[i + 1];
        var b = pixels[i + 2];

        const rgbTexto = document.createElement('div');
        rgbTexto.textContent = `RGB: (${r}, ${g}, ${b})`;
        rgbInput.appendChild(rgbTexto);

        const conjunto = [r, g, b];

        for (let j = 0; j < conjunto.length; j++) {
            var aux = conjunto[j].toString();
            var cif = CryptoJS.AES.encrypt(aux, pwd);
            var auxCifrado = cif.toString(CryptoJS.format.Hex);
            w[x] = (parseInt(auxCifrado, 16) % 255);
            x++;

            var rgbSuma = document.createElement('div');
            rgbSuma.textContent = `SUMA RGB: (${conjunto[0]}, ${conjunto[1]}, ${conjunto[2]})`;
            rgbInput.appendChild(rgbSuma);
        }
    }

    const canvasDos = document.getElementById('Canvas2');
    const ctxNuevo = canvasDos.getContext('2d');
    
    canvasDos.width = imgBMP.width;
    canvasDos.height = imgBMP.height;

    x = 0;
    var i = 0;
    var j = 0;

    for(i = 0; i < canvasDos.height; i++){

        for(j = 0; j < canvasDos.width; j++)
        {
            var r = w[x];
            var g = y[x];
            var b = z[x];

            ctxNuevo.fillRect(j,i,canvasDos.height, canvasDos.width);
            ctxNuevo.fillStyle = `rgb(${r}, ${g}, ${b})`;

            x++;
        }
    }

    const canvasURL = canvasDos.toDataURL('image/bmp');
    var download = document.createElement('a');

    download.href = canvasURL;
    download.download = "img_c.bmp";

    download.click();

}

const iv = CryptoJS.enc.Hex.parse("00112233445566778899AABBCCDDEEFF"); // Vector de inicialización (IV)

function cifradorCBC(pixels, rgbInput, x, imgBMP, canvas) {
    for (let i = 0; i < pixels.length; i += 4) {
        var r = pixels[i];
        var g = pixels[i + 1];
        var b = pixels[i + 2];

        const rgbTexto = document.createElement('div');
        rgbTexto.textContent = `RGB: (${r}, ${g}, ${b})`;
        rgbInput.appendChild(rgbTexto);

        const conjunto = [r, g, b];

        for (let j = 0; j < conjunto.length; j++) {
            var aux = conjunto[j].toString();

            // Realizar una operación XOR con el IV en el primer bloque
            if (x === 0) {
                aux = (aux ^ iv.words[j]).toString(16);
            } else {
                aux = (aux ^ w[x - 3]).toString(16);
            }

            var cif = CryptoJS.AES.encrypt(aux, pwd);

            var auxCifrado = cif.toString(CryptoJS.format.Hex);
            w[x] = (parseInt(auxCifrado, 16) % 255);
            x++;

            var rgbSuma = document.createElement('div');
            rgbSuma.textContent = `SUMA RGB: (${conjunto[0]}, ${conjunto[1]}, ${conjunto[2]})`;
            rgbInput.appendChild(rgbSuma);
        }
    }

    const canvasDos = document.getElementById('Canvas2');
    const ctxNuevo = canvasDos.getContext('2d');
    canvasDos.width = imgBMP.width;
    canvasDos.height = imgBMP.height;

    x = 0;
    var i = 0;
    var j = 0;

    for (i = 0; i < canvasDos.height; i++) {
        for (j = 0; j < canvasDos.width; j++) {
            var r = w[x];
            var g = y[x];
            var b = z[x];

            ctxNuevo.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctxNuevo.fillRect(j, i, 1, 1);
            x++;
        }
    }

    const canvasURL = canvasDos.toDataURL('image/bmp');
    var download = document.createElement('a');
    download.href = canvasURL;
    download.download = "img_c.bmp";
    download.click();
}


function cifradorCFB(pixels, rgbInput, x, imgBMP, canvas) {
    for (let i = 0; i < pixels.length; i += 4) {
        var r = pixels[i];
        var g = pixels[i + 1];
        var b = pixels[i + 2];

        const rgbTexto = document.createElement('div');
        rgbTexto.textContent = `RGB: (${r}, ${g}, ${b})`;
        rgbInput.appendChild(rgbTexto);

        const conjunto = [r, g, b];

        for (let j = 0; j < conjunto.length; j++) {
            // Cifrar el IV para generar la secuencia de retroalimentación
            var auxIV = iv.words[j] ^ w[x - 3];
            var cifIV = CryptoJS.AES.encrypt(auxIV.toString(16), pwd);
            var retroalimentacion = cifIV.toString(CryptoJS.format.Hex);

            // Realizar una operación XOR con la secuencia de retroalimentación
            var aux = (conjunto[j] ^ retroalimentacion).toString(16);
            var cif = CryptoJS.AES.encrypt(aux, pwd);

            var auxCifrado = cif.toString(CryptoJS.format.Hex);
            w[x] = (parseInt(auxCifrado, 16) % 255);
            x++;

            var rgbSuma = document.createElement('div');
            rgbSuma.textContent = `SUMA RGB: (${conjunto[0]}, ${conjunto[1]}, ${conjunto[2]})`;
            rgbInput.appendChild(rgbSuma);
        }
    }

    const canvasDos = document.getElementById('Canvas2');
    const ctxNuevo = canvasDos.getContext('2d');
    canvasDos.width = imgBMP.width;
    canvasDos.height = imgBMP.height;

    x = 0;
    var i = 0;
    var j = 0;

    for (i = 0; i < canvasDos.height; i++) {
        for (j = 0; j < canvasDos.width; j++) {
            var r = w[x];
            var g = y[x];
            var b = z[x];

            ctxNuevo.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctxNuevo.fillRect(j, i, 1, 1);
            x++;
        }
    }

    const canvasURL = canvasDos.toDataURL('image/bmp');
    var download = document.createElement('a');
    download.href = canvasURL;
    download.download = "img_c.bmp";
    download.click();
}