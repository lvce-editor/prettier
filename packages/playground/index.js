import * as prettier from "../extension/third_party/prettier-v3/standalone.mjs";
import parserBabel from "../extension/third_party/prettier-v3/plugins/babel.mjs";

const main = async () => {
  const code = await prettier.format(`let x=1`, {
    parser: "babel",
    plugins: [parserBabel],
  });
  process.stdout.write(code);
};

main();