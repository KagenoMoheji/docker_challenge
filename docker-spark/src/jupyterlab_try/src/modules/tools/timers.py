# ---
# jupyter:
#   jupytext:
#     text_representation:
#       extension: .py
#       format_name: light
#       format_version: '1.5'
#       jupytext_version: 1.7.1
#   kernelspec:
#     display_name: Python 3
#     language: python
#     name: python3
# ---

# +
import time

def process_timer_sec(func):
    def run(*args, **kwargs):
        start = time.time()
        ret = func(*args, **kwargs)
        print ("""
-------[process_timer_sec]-------
function: {0}
time: {1}[sec]
---------------------------------
""".format(
            func.__name__,
            time.time() - start
        ))
        return ret
    return run
