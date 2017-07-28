# import the pandas module
import pandas as pd

# Create an example dataframe about a fictional army
raw_data = {'regiment': ['Nighthawks', 'Nighthawks', 'Nighthawks', 'Nighthawks', 'Dragoons', 'Dragoons', 'Dragoons', 'Dragoons', 'Scouts', 'Scouts', 'Scouts', 'Scouts'],
            'company': ['1st', '1st', '2nd', '2nd', '1st', '1st', '2nd', '2nd','1st', '1st', '2nd', '2nd'],
            'deaths': [523, 52, 25, 616, 43, 234, 523, 62, 62, 73, 37, 35],
            'battles': [5, 42, 2, 2, 4, 7, 8, 3, 4, 7, 8, 9],
            'size': [1045, 957, 1099, 1400, 1592, 1006, 987, 849, 973, 1005, 1099, 1523],
            'veterans': [1, 5, 62, 26, 73, 37, 949, 48, 48, 435, 63, 345],
            'readiness': [1, 2, 3, 3, 2, 1, 2, 3, 2, 1, 2, 3],
            'armored': [1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1],
            'deserters': [4, 24, 31, 2, 3, 4, 24, 31, 2, 3, 2, 3],
            'origin': ['Arizona', 'California', 'Texas', 'Florida', 'Maine', 'Iowa', 'Alaska', 'Washington', 'Oregon', 'Wyoming', 'Louisana', 'Georgia']}

df = pd.DataFrame(raw_data, columns = ['regiment', 'company', 'deaths', 'battles', 'size', 'veterans', 'readiness', 'armored', 'deserters', 'origin'])

df = df.set_index('origin')

# print(df[(df.regiment == 'Nighthawks') & (df.battles == 5)]);

# print(df.ix['California', df[(df['company']) & (df['deaths'])]]);

print(df.ix[df[df.origin == 'Arizona'], ['size', 'veterans']]);
# print(df[(df.ix['Arizona', 'size']) & (df.ix['Arizona', 'regiment'])]);  # getting row and column
# df[(df['f1'] == 1) & (df['f2'] == 2) & (df['f3'] == 3) & (df['f4'] == 4) & (df['f5'] == 5)]


# .ix[row,column]


# get company data from jsons
# (put into objects containing - (per company) company name: {date, text}
# at that date, get stock info from that dataset
