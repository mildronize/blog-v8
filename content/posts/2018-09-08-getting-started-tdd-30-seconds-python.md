+++
title = "Getting Started TDD in 30 Seconds with Python"
date = "2018-09-08"

[taxonomies]
tags = [ "Python", "TDD", "pipenv", "pytest" ]
categories = [ "Python" ]

[extra]
image = "https://www.dropbox.com/s/ai9dub2ym6qv5pb/Getting%20Started%20TDD%20in%2030%20Seconds%20with%20Python.jpg?raw=1"
uuid = "lm28n32"
unsplashImgCoverId = "ieic5Tq8YMk"
+++

Quick start to setup python script for Test Driven Development in 30 seconds

**Time start!**

1. Install Python virtual environment for human ( yay! ) [`pipenv`](https://pipenv.readthedocs.io)

    ```
    sudo pip install pipenv
    ```

2. create a directory and enter to it

    ```
    mkdir my-tdd
    cd my-tdd
    ```

3. Activate Python virtual environment, then the tool will automatically create it (if it’s not exist!)

    ```
    pipenv shell
    ```

4. Install [pytest](https://docs.pytest.org/) as a dev dependency

    ```
    pipenv install pytest --dev
    ```

5. create file and test file in any place of the directory

    ```python
    # in lib.py
    def hello():
        return "hello"

    # in lib_test.py or test_lib.py
    import lib
    def test_hello():
        assert lib.hello() == "hello"
    ```

6. let’s test

    ```
    pytest
    ```

Getting result!


![img](https://www.dropbox.com/s/bgwfkw2d70jp4xk/Getting%20Started%20TDD%20in%2030%20Seconds%20with%20Python-02.png?raw=1)

The structure will be like this

```
lib.py
lib_test.py
Pipfile
Pipfile.lock
```

### **Extra!**

You can use automatically test your code when the code's changed using [pytest-watch](https://github.com/joeyespo/pytest-watch)

```
pipenv install pytest-watch
```

Let’s fun with TDD

```
ptw
```

**Time stoppppppppppp!**

As I said before, this blog will end within 30 seconds

Thanks guy, any question, pls comment

Good bye, see you

P.S. fastest blogging ever 🙏

---

 *Cross published at [Medium.com](https://medium.com/@mildronize/getting-started-tdd-in-30-seconds-with-python-8113d6c94753)*
