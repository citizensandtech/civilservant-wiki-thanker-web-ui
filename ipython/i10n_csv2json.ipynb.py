# coding: utf-8
dfi = df.set_index('key')
dfi.dropna(inplace=True)
dfi.to_json(f'/home/paprika/Downloads/gratitude_internationalizations.csv.index.json', orient='index')
