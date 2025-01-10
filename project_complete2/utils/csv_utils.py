import csv

def merge_csv_files(file1, file2, output_file):
    """
    두 CSV 파일을 병합하여 새로운 CSV 파일로 저장합니다.
    """
    with open(file1, 'r', encoding='utf-8') as f1, open(file2, 'r', encoding='utf-8') as f2, open(output_file, 'w', newline='', encoding='utf-8') as out:
        reader1 = csv.reader(f1)
        reader2 = csv.reader(f2)
        writer = csv.writer(out)

        header1 = next(reader1)
        header2 = next(reader2)

        if header1 != header2:
            raise ValueError("CSV headers do not match!")

        writer.writerow(header1)
        writer.writerows(reader1)
        writer.writerows(reader2)
