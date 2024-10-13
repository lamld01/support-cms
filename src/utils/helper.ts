// Hàm lọc các thuộc tính có giá trị rỗng
export const filterEmptyKeys = (obj: Record<string, any>) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => value !== '')
    );
  };

  