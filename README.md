# formalot

## Frontend

After cloning the project, run

```
cd frontend
yarn install
yarn start
```

## Backend
Please create a virtual environment first.
*For MacOS*
```
python3 -m venv formalot-env
```
Install the packages written in requirements.txt.
```
pip -r install requirements.txt
```
If you installed new packages and need other people to use the same version of packages, write the info into txt.
```
pip freeze > requirements.txt
```

If you don't create virtual environment:
Please install Flask first.

```
pip install Flask
```
After cloning the project, run

```
cd backend
flask run
```
