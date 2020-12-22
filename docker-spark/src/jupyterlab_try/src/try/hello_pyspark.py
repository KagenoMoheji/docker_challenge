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

print("Hello!!")

# %ls -la

# %pip list

# +
import pandas as pd
from pyspark.sql import SparkSession
from pyspark.sql.types import (
    StructType, StructField,
    StringType, IntegerType
)

# マスターノードはdocker-compose.ymlで定義したservice名を使う．
# .enableHiveSupport()
# .config() # spark.executor.memoryとか…
spark = SparkSession\
            .builder\
            .appName("pyspark-jupyterlab")\
            .master("spark://spark-driver:7077")\
            .getOrCreate()

# pyspark-dataframe．pandas-dataframe=pddfと区別．
pddf = pd.DataFrame({
    "Name": ["Alice", "Bob", "Cassy", "Kate"],
    "Count": [1, 2, 3, 4]
})
# print(pddf)
# print(type(pddf))
display(pddf)

schema = StructType([
    StructField("name", StringType(), False),
    StructField("count", IntegerType(), False)
])
spdf = spark.createDataFrame(pddf, schema = schema)
# print(spdf)
# print(type(spdf))
display(spdf)
print(spdf.toPandas())
# spdf.show()
# -


