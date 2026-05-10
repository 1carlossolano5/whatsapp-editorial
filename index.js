const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const axios = require('axios');

const INSTANCE_ID = 'instance174354';
const TOKEN = 'kfl849l7p1a8a4dz';

const sesiones = {};
const timers = {};

function limpiarTimers(telefono) {
    if (timers[telefono]) {
        clearTimeout(timers[telefono].inactivo);
        clearTimeout(timers[telefono].cerrar);
    }
    timers[telefono] = {};
}

async function enviarMensaje(telefono, texto) {
    try {
        await axios.post(`https://api.ultramsg.com/${INSTANCE_ID}/messages/chat`, {
            token: TOKEN,
            to: telefono,
            body: texto
        });
    } catch (err) {
        console.log('Error enviando mensaje:', err.message);
    }
}

function obtenerRespuesta(mensajeUsuario, telefono) {
    const texto = mensajeUsuario.toLowerCase().trim();
    const sesion = sesiones[telefono] || { paso: 'inicio' };

    if (texto === '0' || texto === 'salir' || texto === 'adios') {
        delete sesiones[telefono];
        limpiarTimers(telefono);
        return 'Hasta luego! Gracias por contactar a Editorial Letras de Colombia. Que disfrutes tu lectura!';
    }

    if (sesion.paso === 'esperando_confirmacion') {
        if (texto === 'si' || texto === '1') {
            sesiones[telefono] = { paso: 'menu' };
            return 'Perfecto! Continuamos.\n\n1 Catalogo de libros\n2 Hacer un pedido\n3 Estado de mi pedido\n4 Precios y formas de pago\n5 Eventos y ferias literarias\n6 Distribuidores y puntos de venta\n7 Trabaja con nosotros\n8 Contacto y ubicacion\n9 Hablar con un asesor\n0 Salir';
        } else {
            delete sesiones[telefono];
            limpiarTimers(telefono);
            return 'Hasta luego! Gracias por contactar a Editorial Letras de Colombia.';
        }
    }

    if (texto === 'hola' || texto === 'inicio' || texto === 'menu') {
        sesiones[telefono] = { paso: 'menu' };
        return 'Bienvenido a Editorial Letras de Colombia!\n\nSomos una editorial con mas de 20 anos llevando la literatura colombiana al mundo.\n\n1 Catalogo de libros\n2 Hacer un pedido\n3 Estado de mi pedido\n4 Precios y formas de pago\n5 Eventos y ferias literarias\n6 Distribuidores y puntos de venta\n7 Trabaja con nosotros\n8 Contacto y ubicacion\n9 Hablar con un asesor\n0 Salir';
    }

    if (texto === '1' || texto === 'catalogo') {
        sesiones[telefono] = { paso: 'catalogo' };
        return 'Catalogo Editorial Letras de Colombia\n\n1 Literatura colombiana\n2 Literatura latinoamericana\n3 Poesia\n4 Libros infantiles y juveniles\n5 Historia y ciencias sociales\n6 Academicos y universitarios\n7 Autoayuda y desarrollo personal\n\nEscribe el numero del genero.\nO escribe menu para volver al inicio.';
    }

    if (sesion.paso === 'catalogo') {
        if (texto === '1') return 'Literatura Colombiana\n\nRio sin orillas - Jorge Franco - $48.000\nLa vida de los muertos - Piedad Bonnett - $52.000\nEl ruido de las cosas al caer - Juan Gabriel Vasquez - $55.000\nFue asi - Tomas Gonzalez - $44.000\nSatanas - Mario Mendoza - $46.000\n\nTe interesa alguno? Escribeme el titulo.\nO escribe menu para volver.';
        if (texto === '2') return 'Literatura Latinoamericana\n\nPedro Paramo - Juan Rulfo - $38.000\nRayuela - Julio Cortazar - $52.000\nLa casa de los espiritus - Isabel Allende - $58.000\nEl tunel - Ernesto Sabato - $42.000\nFicciones - Jorge Luis Borges - $45.000\n\nTe interesa alguno? Escribeme el titulo.\nO escribe menu para volver.';
        if (texto === '3') return 'Poesia\n\nVeinte poemas de amor - Pablo Neruda - $32.000\nLos versos del capitan - Pablo Neruda - $35.000\nAntologia poetica - Leon de Greiff - $40.000\nEl libro de los abrazos - Eduardo Galeano - $44.000\n\nTe interesa alguno? Escribeme el titulo.\nO escribe menu para volver.';
        if (texto === '4') return 'Libros Infantiles y Juveniles\n\nEl principito - Saint-Exupery - $28.000\nMatilda - Roald Dahl - $32.000\nManolito Gafotas - Elvira Lindo - $30.000\nEl diario de un nino rata - Jeff Kinney - $35.000\nCuentos de la selva - Horacio Quiroga - $26.000\n\nTe interesa alguno? Escribeme el titulo.\nO escribe menu para volver.';
        if (texto === '5') return 'Historia y Ciencias Sociales\n\nColombia una nacion a pesar de si misma - David Bushnell - $62.000\nHistoria de Colombia - German Arciniegas - $58.000\nAsi hablo Colombia - Varios autores - $55.000\nLa violencia en Colombia - Orlando Fals Borda - $60.000\n\nTe interesa alguno? Escribeme el titulo.\nO escribe menu para volver.';
        if (texto === '6') return 'Libros Academicos y Universitarios\n\nIntroduccion al derecho - Hernando Devis Echandia - $75.000\nFundamentos de administracion - Varios autores - $68.000\nEstadistica para administracion - Berenson - $82.000\nBiologia molecular - Watson - $90.000\n\nEscribe tu carrera y te ayudo a encontrar el libro.\nO escribe menu para volver.';
        if (texto === '7') return 'Autoayuda y Desarrollo Personal\n\nLos cuatro acuerdos - Miguel Ruiz - $38.000\nEl poder del ahora - Eckhart Tolle - $42.000\nHabitos atomicos - James Clear - $52.000\nLa inteligencia emocional - Daniel Goleman - $48.000\nEl monje que vendio su Ferrari - Robin Sharma - $40.000\n\nTe interesa alguno? Escribeme el titulo.\nO escribe menu para volver.';
    }

    if (texto === '2' || texto === 'pedido' || texto === 'comprar') {
        sesiones[telefono] = { paso: 'pedido' };
        return 'Como hacer un pedido?\n\nWeb: www.editorialletras.com.co\nTelefono: 601 234 5678\nPor WhatsApp: Escribeme el titulo y tu ciudad.\n\nTiempos de entrega:\nBogota: 1 a 2 dias habiles\nOtras ciudades: 3 a 5 dias habiles\nInternacional: 10 a 15 dias habiles\n\nO escribe menu para volver al inicio.';
    }

    if (texto === '3' || texto === 'estado') {
        sesiones[telefono] = { paso: 'estado_pedido' };
        return 'Consultar estado de pedido\n\nEscribeme tu numero de pedido.\nEjemplo: EL-2026-0081\n\nO escribe menu para volver al inicio.';
    }

    if (sesion.paso === 'estado_pedido') {
        if (texto.startsWith('el-')) {
            return 'Pedido ' + mensajeUsuario.toUpperCase() + ' encontrado\n\nTitulo: Habitos atomicos\nEstado: En camino\nTransportadora: Servientrega\nEntrega estimada: 12 de mayo de 2026\nGuia: SRV-887234\n\nEscribe menu para volver al inicio.';
        } else {
            return 'No encontre ese numero de pedido.\nFormato correcto: EL-2026-0081\nO escribe asesor para hablar con una persona.';
        }
    }

    if (texto === '4' || texto === 'pago' || texto === 'precio') {
        return 'Precios y Formas de Pago\n\nLibros desde $26.000 hasta $90.000 COP\n\nFormas de pago:\nEfectivo contra entrega\nTarjeta debito y credito\nNequi y Daviplata\nTransferencia bancaria\nPSE en nuestra web\n\nDescuentos:\nEstudiantes: 10% con carne\n5 libros o mas: 15%\nColegios y universidades: 20%\n\nO escribe menu para volver al inicio.';
    }

    if (texto === '5' || texto === 'eventos' || texto === 'ferias') {
        return 'Eventos y Ferias Literarias 2026\n\nFILBo Bogota\nCorferias - Stand 412\n26 abril al 11 mayo\n\nFeria del Libro de Cali\nPlaza Mayor\n15 al 25 de junio\n\nFestival Literatura Medellin\nParque Explora\n10 al 20 de julio\n\nDescuentos hasta 30% en todos los eventos.\n\nO escribe menu para volver al inicio.';
    }

    if (texto === '6' || texto === 'distribuidores') {
        return 'Puntos de Venta\n\nBogota:\nLibreria Nacional - Calle 72\nLibreria Lerner - Av. Jimenez\nPanamericana - Centro Andino\n\nMedellin:\nLibreria Prometeo - El Poblado\nJardin de Libros - Laureles\n\nCali:\nLibreria Nacional - Chipichape\nLibros y Libros - Granada\n\nDigital:\nwww.editorialletras.com.co\nRappi, Mercado Libre, Amazon\n\nO escribe menu para volver al inicio.';
    }

    if (texto === '7' || texto === 'trabajo' || texto === 'empleo') {
        return 'Trabaja con Nosotros\n\nVacantes:\nEditor de contenidos - Bogota\nCommunity Manager - Remoto\nDisenador grafico - Bogota\nAuxiliar de bodega - Bogota\n\nEres autor?\npublicaciones@editorialletras.com.co\n\nAplicar:\nrrhh@editorialletras.com.co\n\nO escribe menu para volver al inicio.';
    }

    if (texto === '8' || texto === 'contacto' || texto === 'ubicacion') {
        return 'Contacto y Ubicacion\n\nCalle 93 #15-28 Piso 3, Bogota\nTelefono: 601 234 5678\nCelular: 310 987 6543\nCorreo: info@editorialletras.com.co\nWeb: www.editorialletras.com.co\n\nHorario:\nLun-Vie: 8am-6pm\nSabados: 9am-1pm\n\nInstagram y Facebook: @editorialletras\n\nO escribe menu para volver al inicio.';
    }

    if (texto === '9' || texto === 'asesor' || texto === 'persona') {
        return 'Conectando con un asesor...\n\nUn miembro del equipo teatendera pronto.\n\nHorario:\nLun-Vie: 8am-6pm\nSabados: 9am-1pm\n\nEscribe menu para ver las opciones.';
    }

    return 'No entendi tu mensaje.\n\nEscribe hola o menu para ver todas las opciones.\nO escribe asesor para hablar con una persona.';
}

app.post('/webhook', async (req, res) => {
    res.sendStatus(200);

    const data = req.body;
    console.log('Data recibida:', JSON.stringify(data));

    const mensajeUsuario = data.body || data.Body || '';
    const telefono = data.from || data.From || '';

    if (!mensajeUsuario || !telefono) return;
    if (data.fromMe) return;

    console.log('Mensaje:', mensajeUsuario, 'De:', telefono);

    limpiarTimers(telefono);

    const respuesta = obtenerRespuesta(mensajeUsuario, telefono);

    timers[telefono].inactivo = setTimeout(() => {
        sesiones[telefono] = { paso: 'esperando_confirmacion' };
        enviarMensaje(telefono, 'Sigues ahi? Responde si para continuar o no para cerrar.');
    }, 2 * 60 * 1000);

    timers[telefono].cerrar = setTimeout(() => {
        enviarMensaje(telefono, 'La sesion se cerro por inactividad. Escribe hola para volver a empezar.');
        delete sesiones[telefono];
        delete timers[telefono];
    }, 5 * 60 * 1000);

    await enviarMensaje(telefono, respuesta);
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Bot corriendo');
});