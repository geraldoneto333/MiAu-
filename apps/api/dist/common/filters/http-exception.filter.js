"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = exports.FastApiExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let FastApiExceptionFilter = class FastApiExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        let detail;
        if (typeof exceptionResponse === 'string') {
            detail = exceptionResponse;
        }
        else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
            const msg = exceptionResponse.message;
            detail = Array.isArray(msg) ? msg[0] : (msg ?? exception.message);
        }
        else {
            detail = exception.message;
        }
        response.status(status).json({ detail });
    }
};
exports.FastApiExceptionFilter = FastApiExceptionFilter;
exports.FastApiExceptionFilter = FastApiExceptionFilter = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], FastApiExceptionFilter);
let AllExceptionsFilter = class AllExceptionsFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        if (exception instanceof common_1.HttpException) {
            const filter = new FastApiExceptionFilter();
            filter.catch(exception, host);
            return;
        }
        const message = exception instanceof Error ? exception.message : 'Erro interno do servidor';
        response.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ detail: message });
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=http-exception.filter.js.map