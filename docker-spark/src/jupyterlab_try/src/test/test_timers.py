# -*- coding: utf-8 -*-
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
import sys
sys.path.append("../")
from modules.tools.timers import process_timer_sec

@process_timer_sec
def hello():
    print("hello")
hello()

@process_timer_sec
def plus(a, b):
    return a + b
print(plus(1, 4))

# -


