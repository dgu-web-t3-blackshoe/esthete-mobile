import React, { useState } from "react";

//요소
import { Text, View, TouchableOpacity, TextInput } from "react-native";
import GlobalStyles from "../../assets/styles";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

export const Step3 = ({
  date,
  setDate,
  dateText,
  setDateText,
  genreOption,
  toggleGenreModal,
  equipments,
  setEquipments,
}: any) => {
  const [showDate, setShowDate] = useState<boolean>(false);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    setShowDate(false);

    if (event.type === "set" && selectedDate) {
      setDateText(selectedDate.toISOString().split("T")[0]);
    }
  };

  return (
    <View style={{ width: 300 }}>
      {/* 날짜 시작 */}
      <View
        style={{
          ...GlobalStyles.rowSpaceBetweenContainer,
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            color: "white",
            fontWeight: "500",
          }}
        >
          Time
        </Text>
        <TouchableOpacity
          onPress={() => setShowDate(true)}
          style={{
            backgroundColor: "white",
            paddingHorizontal: 10,
          }}
        >
          <Text
            style={{
              width: 200,
              paddingVertical: 5,
              color: "#7D7D7D",
            }}
          >
            {dateText}
          </Text>
        </TouchableOpacity>
        {showDate ? (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={"date"}
            display="default"
            onChange={onChange}
          />
        ) : null}
      </View>
      {/* 날짜 끝 */}
      {/* 장르 시작 */}

      <Text
        style={{
          fontSize: 22,
          color: "white",
          fontWeight: "500",
        }}
      >
        Genres
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: "white",
          paddingHorizontal: 15,
          paddingVertical: 5,
          marginVertical: 10,
        }}
        onPress={toggleGenreModal}
      >
        {genreOption.length > 0 ? (
          <Text>
            {genreOption.length > 3
              ? `${genreOption.slice(0, 3).join(", ")}, ...`
              : genreOption.join(", ")}
          </Text>
        ) : (
          <Text>장르를 선택하세요.</Text>
        )}
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 22,
          color: "white",
          fontWeight: "500",
          marginVertical: 10,
        }}
      >
        Equipments
      </Text>
      <TextInput
        // onEndEditing={}
        style={{
          borderWidth: 0.8,
          padding: 15,
          lineHeight: 22,
          height: 80,
          backgroundColor: "white",
        }}
        multiline
        value={equipments}
        placeholder="사진 찍을 때 사용한 장비를 입력하세요."
        onChangeText={(text) => setEquipments(text)}
      />
    </View>
  );
};
