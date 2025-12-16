import pandas as pd
from pathlib import Path
# Get the directory where the script is located
script_dir = Path(__file__).parent

# 1. Đọc dữ liệu
df = pd.read_csv(script_dir / "valid.csv")

# 2. Tạo từ điển quy đổi (Mapping Dictionary)
# Đây là quy tắc gộp nhãn chuẩn cho bộ UIT-VSMEC
label_mapping = {
    # Nhóm Tích cực (Gán số 2)
    'Enjoyment': 2,
    
    # Nhóm Tiêu cực (Gán số 0)
    'Sadness': 0,
    'Anger': 0,
    'Fear': 0,
    'Disgust': 0,
    
    # Nhóm Trung tính (Gán số 1)
    'Surprise': 1,  # Ngạc nhiên có thể tốt/xấu nên đưa vào trung tính
    'Other': 1      # Các loại khác
}

# 3. Thực hiện gộp (Tạo cột mới tên là 'label_id')
df['label_id'] = df['Emotion'].map(label_mapping)

# 4. Kiểm tra kết quả
print("Số lượng mẫu sau khi gộp:")
print(df['label_id'].value_counts())
# 4. Xóa cột Emotion
df = df.drop(columns=['Emotion'])

# 5. Lưu ra file mới để dùng huấn luyện
df.to_csv(script_dir / "valid_data_3_labels.csv", index=False)