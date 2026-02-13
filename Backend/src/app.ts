import app from "./server";
import { env } from "./config/env";

app.listen(env.PORT, () => {
    console.log('Api escuchando en el puerto: ' + env.PORT);
})