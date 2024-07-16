import pandas as pd

# CSV 파일 읽기
file_path = '/mnt/data/cons.csv'
df = pd.read_csv(file_path)

# 데이터 프레임을 딕셔너리 형태로 변환
conversations = df.to_dict('records')

# JSON 형태로 변환하여 저장
import json
json_file_path = '/mnt/data/conversations.json'
with open(json_file_path, 'w', encoding='utf-8') as json_file:
    json.dump(conversations, json_file, ensure_ascii=False, indent=4)

json_file_path
