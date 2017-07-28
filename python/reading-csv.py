import pandas as pd

# reading data
df = pd.read_csv("../input/prices-split-adjusted.csv", index_col = 0)
df["adj close"] = df.close # Moving close to the last column
df.drop(['close'], 1, inplace=True) # Moving close to the last column
df.head()

df2 = pd.read_csv("../input/fundamentals.csv")
df2.head()

# get symbols
symbols = list(set(df.symbol))
len(symbols)


df = df[df.symbol == 'GOOG']
df.drop(['symbol'],1,inplace=True)
df.head()
