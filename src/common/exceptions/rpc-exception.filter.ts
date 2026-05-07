
import { RpcException } from '@nestjs/microservices';
import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
    catch(exception: RpcException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const resp = ctx.getResponse()

        const rpcError = exception.getError()

        if (typeof rpcError === 'object' && 'status' in rpcError && 'message' in rpcError ) {
            const status = isNaN(+(rpcError as any).status) ? 400 : +(rpcError as any).status
            return resp.status(status).json(rpcError)
        }

        resp.status(400).json({
            status: 400,
            message: rpcError
        })
    }
}
