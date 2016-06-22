# Luno Frontend

## Usage

Install all dependencies & Start developing
```bash
$ npm install
$ npm run dev
```

Launch your web browswer and go to `http://localhost:3000`.

## Running Management Scripts

To run management scripts:

- create a script within `server/management/scripts/`
- release the container
- execute the script once the container has been deployed:
```
npm run script <script-name>
```
