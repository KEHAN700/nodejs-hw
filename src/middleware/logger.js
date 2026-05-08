import PinoHttp from "pino-http";

const logger = PinoHttp({   
    transport: {    
        target: 'pino-pretty',
        options: { colorize: true }
    }
}); 


export default logger;