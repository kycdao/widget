/*


//
// run as
//   node_modules/.bin/ts-node-esm --skipProject -O '{"module": "esnext", "target": "esnext"}' scripts/build.mts


tested with

$ ./node_modules/.bin/ts-node -vv
ts-node v10.9.1
node v19.3.0
compiler v4.9.4


TODO: use https://github.com/sindresorhus/execa

*/
import { fileURLToPath } from 'url';
import { spawn } from "child_process"
import { mkdirSync } from "fs";
import path from "path";
import { env, exit } from "process"

env.PATH = `${path.join(path.dirname(fileURLToPath(import.meta.url)), '../node_modules/.bin')}${path.delimiter}${env.PATH}`;

console.log(env.PATH);

mkdirSync("dist", { recursive: true })

await spawn("rimraf", ["build", "dist"])

const run = async (bin: string, args: string[]) => {
    const child = spawn(bin, args)

    for await (const chunk of child.stdout) {
        console.log(chunk.toString('utf-8'));
    }

    for await (const chunk of child.stderr) {
        console.error(chunk.toString('utf-8'));
    }

    const exitCode: number = await new Promise( (resolve) => {
        child.on('close', resolve);
    });

    if(exitCode > 0) {
        throw new Error( `subprocess error exit ${exitCode}`);
    }
}

const b = await Promise.all([
    run("yarn", ["build:lib"]),
    run("yarn", ["build:web"])
])



console.log(b)


// "build": "&& tsc-alias -p tsconfig.json && mv ./build/ ./dist/web && cp ./dist/web/*.(html|ico|css*) ./dist && cp ./dist/*.(ico|css*) ./public && yarn build:hotfix && tsc-alias -p tsconfig.umd.json & tsc-alias -p tsconfig.esm.json && yarn build:web-styles",