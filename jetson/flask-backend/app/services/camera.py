# import cv2

# cap = cv2.VideoCapture(0)

# if not cap.isOpened():
#     print("🚨 카메라를 열 수 없습니다!")
# else:
#     print("✅ 카메라가 정상적으로 열렸습니다!")

# cap.release()

# import cv2

# print("🔍 사용 가능한 카메라 인덱스 찾기...")

# for i in range(5):  # 0~4번 카메라 확인
#     cap = cv2.VideoCapture(i)
#     if cap.isOpened():
#         print(f"✅ 카메라 {i}번을 사용할 수 있습니다!")
#         cap.release()
#     else:
#         print(f"❌ 카메라 {i}번을 열 수 없습니다.")

