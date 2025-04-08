import pino from 'pino';

// Configuración del logger
const logger = pino(
  {
    level: 'info',
    timestamp: pino.stdTimeFunctions.isoTime, // Timestamp ISO base
    formatters: {
      level(label) {
        return { level: label.toUpperCase() }; // Niveles en mayúsculas
      },
      log(object) {
        const msg = object.msg || '';
        const meta = { ...object };
        delete meta.msg;
        delete meta.level;
        delete meta.time;
        return Object.keys(meta).length ? { msg, meta: JSON.stringify(meta, null, 2).replace(/"/g, '') } : { msg };
      },
    },
    // Transporte para consola con pino-pretty
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'yyyy-mm-dd HH:mm:ss', // Formato legible
        messageFormat: '{time} [{level}] {msg}{if meta}\n    {meta}{end}',
        ignore: 'pid,hostname,time', // Quitar PID y hostname
      },
    },
  },
  pino.multistream([
    { stream: pino.destination('error.log'), level: 'error' },
    { stream: pino.destination('combined.log'), level: 'info' },
  ]),
);

export { logger };
