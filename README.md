# Hellpass

Hellpass is a Django application to store, view, manage and rotate passwords. It's API driven using the Django Rest Framework. But also accessible through a Jquery enabled interactive frontend.

## Installation

Strongly recommend using a python3 virtual environment to run this:

```python
python3 -m virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

## Usage

### Web UI
Features real time filtering search, and the ability to edit several fields and save all changes with a post to the Database.

 ![alt text](https://github.com/hfeixas/Hellpass/blob/master/images/password_manager.png)

### API

Post to the database to get all passwords.
```json
{
    "data": [
        {
            "pk": 22,
            "name": "google",
            "url": "google.com",
            "username": "user",
            "password": "password",
            "expires": null
        },
        {
            "pk": 24,
            "name": "yahoo",
            "url": "yahoo.com",
            "username": "user",
            "password": "password",
            "expires": null
        }
    ]
}
```
## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
