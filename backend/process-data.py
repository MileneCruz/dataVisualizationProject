import pandas as pd
import plotly.express as px
import json

df = pd.read_csv('newdisneydataset.csv')

df['year'] = pd.to_numeric(df['year'], errors='coerce')
df = df[df['year'] >= (df['year'].max() - 19)]

genre_gross = df.groupby('genre')['inflation_adjusted_gross'].sum().reset_index()

top_5_genres = genre_gross.nlargest(5, 'inflation_adjusted_gross')['genre'].tolist()

df_top_5 = df[df['genre'].isin(top_5_genres)]

df_grouped = df_top_5.groupby(['genre', 'year'])['inflation_adjusted_gross'].sum().reset_index()

df_grouped.to_json('data.json', orient='records')

pastel_colors = ['#FFB6C1', '#87CEEB', '#98FB98', '#FFD700', '#DDA0DD']

fig = px.line(df_grouped, x='year', y='inflation_adjusted_gross', color='genre',
              title='Revenue evolution of the 5 largest genres after 1996',
              labels={'year': 'Year', 'inflation_adjusted_gross': 'Inflation Adjusted Gross', 'genre': 'Genre'},
              line_shape='linear', color_discrete_sequence=pastel_colors)

fig.update_xaxes(dtick=2)

fig.show()
