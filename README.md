# Curios Ear

Your voice deserves to be heard.

## Gulp Workflow

You must have Node installed. To run the gulp workflow first make sure you have all packages:

`npm install`

Make sure you have Gulp installed. There is already great documentation on how to get setup with [Gulp on Github](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md).

Now you have a few commands to use:

- **When in development** - Use the command `gulp dev`. This will load up your development server (`http://localhost:3000/`) and living styleguide (`http://localhost:3002/`).
- **When you need a production ready build** - If you need everything compressed and tidy use `gulp build`. You will find the production ready code in `/dest`.
- **Just run the styleguide** - Use the command 'gulp styleguide`. This will give you a dev server for styleguide development and build out your styleguide

--------------------------------------------------------------------------------

## CSS Guidelines

We try to keep our code as clean and consistent as possible. You can find some of our rules and tools to rangle your code below.

CSS comb automatically sorts and cleans your code. The linter will warn you when your code does not match standards.

### CSS Comb

- Remove empty rulesets
- Always use semicolins at the end of a declaration
- All colors should be lowercase
- two (2) space indents, no tabs;
- Use Expanded hexadecimals
- All selectors should be lowercase
- Add line break at end of file
- Add leading zero's to decimals (`0.1`)
- Use single quotes (`''`)
- Each declaration should have no space between the property and colon but a space after the colon ('property: declaration;')
- There should be a space before and after a combinator ('.class > .class {}')
- Separate each CSS rule with a line break
- the bracket and the selector should be on the same line with a space in between
- There should be a line break after the opening bracket
- Each declaration should be on it's own line
- remove space between selector and delimiter ('.a, .b')
- There should be a line break before every closing bracket
- Trim trailing spaces
- No hard tabs. Use 2 spaces.
- Remove units for 0
- Includes and Extends should be at the top of a declaration block
- each selector should be on it's own line and have no space between a selector and a comma

[CSScomb](http://csscomb.com/) is super helpful for making your CSS consistent and beautiful. Most code editors have a plugin for it. It will help you follow the rules above

The CSS Comb settings file is in `frontend_tools/css_guidelines`. Install the [CSS Comb](http://csscomb.com/) plugin and then include the `.csscomb.json` file in your project.

### CSS Linter

First install the [base linter](https://github.com/steelbrain/linter) plugin for your text editor. The Sass-lint settings file is in `frontend_tools/css_guidelines`. Install the [sass-lint](https://github.com/sasstools/sass-lint) plugin and then include the `.sass-lint.yml` file in your project.
