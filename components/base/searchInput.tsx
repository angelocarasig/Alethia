import React, { useEffect, useState, useRef } from 'react';
import { TouchableWithoutFeedback, TextInput, Pressable, Keyboard } from 'react-native';
import { XStack, Input, Paragraph, ScrollView } from 'tamagui';

interface SearchInputProps {
  placeholder: string;
  onSearchChange: (searchText) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder, onSearchChange }) => {
  const [text, setText] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setShowCancel(text !== '');
    onSearchChange(text);
  }, [text]);

  const handleCancel = () => {
    setText('');
    handleOutsideClick();
  };

  const handleOutsideClick = () => {
    inputRef.current?.blur();
    Keyboard.dismiss();
  };

  return (
    <XStack width="100%" ai="center" gap="$4">
      <Input
        ref={inputRef}
        f={1}
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
      />
      {showCancel && <Paragraph onPress={handleCancel}>Cancel</Paragraph>}
    </XStack>
  );
};

export default SearchInput;
