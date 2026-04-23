// main.js example with Commander
import { program } from "commander";

program
  .command("greet <name>")
  .description("Say hello to someone")
  .option("-s, --shout", "Greet in uppercase") // Optional flag
  .action((name, options) => {
    let message = `Hello, ${name}!`;

    if (options.shout) {
      console.log(message.toUpperCase());
    } else {
      console.log(message);
    }
  });

// 2. Define the command 'add'
program
  .command("add <num1> <num2>")
  .description("Add two numbers together")
  .action((num1, num2) => {
    console.log(Number(num1) + Number(num2));
  });

// 3. This line is required to actually start the parser
program.parse(process.argv);
