import 'react-native-reanimated';
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Platform,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import CustomModal from './src/customModal';
import Carousel  from 'react-native-reanimated-carousel';

const App = () => {
 
  

  const [modalVisible, setModalVisible] = useState(false);
  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [cardTitle, setCardTitle] = useState('');
  const [cardDesc, setCardDesc] = useState('');
  const [cardImportance, setCardImportance] = useState('Medium');
  const [selectedListIndex, setSelectedListIndex] = useState(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [lists, setLists] = useState([]);

  const handleClearAll = () => {
    setLists([]);
  };

  const handleAddList = () => {
    setModalVisible(true);
  };

  const handleSubmitTitle = () => {
    if (titleInput.trim()) {
      setLists([
        ...lists,
        {id: Date.now(), title: titleInput.trim(), cards: []},
      ]);
      setTitleInput('');
      setModalVisible(false);
    }
  };

  const handleAddCard = id => {
    const index = lists.findIndex(l => l.id === id);
    if (index !== -1) {
      setSelectedListIndex(index);
      setCardTitle('');
      setCardDesc('');
      setCardImportance('Medium');
      setCardModalVisible(true);
    }
  };

  const handleCreateCard = () => {
    if (
      cardTitle.trim() &&
      selectedListIndex !== null &&
      lists[selectedListIndex]
    ) {
      const newCard = {
        title: cardTitle,
        description: cardDesc,
        importance: cardImportance,
      };

      const updatedLists = [...lists];
      updatedLists[selectedListIndex].cards.push(newCard);

      setLists(updatedLists);
      setCardModalVisible(false);
    } else {
      console.warn('Invalid list index or card title');
    }
  };

  const handlePreviewCard = (listId, cardIndex) => {
    const listIndex = lists.findIndex(l => l.id === listId);
    if (listIndex === -1) return;
  
    const card = lists[listIndex].cards[cardIndex];
    if (!card) return;
  
    setSelectedListIndex(listIndex);
    setSelectedCardIndex(cardIndex);
    setCardTitle(card.title);
    setCardDesc(card.description);
    setCardImportance(card.importance);
    setPreviewModalVisible(true);
  };
  

  const handleSavePreviewCard = () => {
    const updatedLists = [...lists];
    updatedLists[selectedListIndex].cards[selectedCardIndex] = {
      title: cardTitle,
      description: cardDesc,
      importance: cardImportance,
    };
    setLists(updatedLists);
    setPreviewModalVisible(false);
  };

  const handleDeleteCard = () => {
    const updatedLists = [...lists];
    updatedLists[selectedListIndex].cards.splice(selectedCardIndex, 1);
    setLists(updatedLists);
    setPreviewModalVisible(false);
  };

  const logo = 'https://reactnative.dev/img/tiny_logo.png';

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{uri: logo}} style={styles.logo} resizeMode="contain" />
        <View style={styles.leftButtons}>
          <TouchableOpacity onPress={handleClearAll} style={styles.button}>
            <Text style={styles.buttonText}>Clear All List</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAddList} style={styles.button}>
            <Text style={styles.buttonText}>Add List</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add List Modal */}
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}>
        <Text style={styles.modalTitle}>Enter List Title</Text>
        <TextInput
          value={titleInput}
          onChangeText={setTitleInput}
          style={styles.input}
          placeholder="Title"
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          onPress={handleSubmitTitle}
          style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Add</Text>
        </TouchableOpacity>
      </CustomModal>

      {/* Add Card Modal */}
      <CustomModal
        visible={cardModalVisible}
        onClose={() => setCardModalVisible(false)}>
        <Text style={styles.modalTitle}>Create Card</Text>
        <TextInput
          value={cardTitle}
          onChangeText={setCardTitle}
          placeholder="Card Title"
          placeholderTextColor="#999"
          style={styles.input}
        />
        <TextInput
          value={cardDesc}
          onChangeText={setCardDesc}
          placeholder="Description"
          placeholderTextColor="#999"
          style={styles.input}
        />
        {Platform.OS === 'android' ? (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={cardImportance}
              onValueChange={itemValue => setCardImportance(itemValue)}
              style={styles.picker}>
              <Picker.Item label="High" value="High" />
              <Picker.Item label="Medium" value="Medium" />
              <Picker.Item label="Low" value="Low" />
            </Picker>
          </View>
        ) : (
          <TextInput
            value={cardImportance}
            onChangeText={setCardImportance}
            placeholder="Importance (High/Medium/Low)"
            placeholderTextColor="#999"
            style={styles.input}
          />
        )}
        <TouchableOpacity
          onPress={handleCreateCard}
          style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Create Card</Text>
        </TouchableOpacity>
      </CustomModal>

      {/* Preview/Edit/Delete Card Modal */}
      <CustomModal
        visible={previewModalVisible}
        onClose={() => setPreviewModalVisible(false)}>
        <Text style={styles.modalTitle}>Edit Card</Text>
        <TextInput
          value={cardTitle}
          onChangeText={setCardTitle}
          placeholder="Card Title"
          style={styles.input}
        />
        <TextInput
          value={cardDesc}
          onChangeText={setCardDesc}
          placeholder="Description"
          style={styles.input}
        />
        {Platform.OS === 'android' ? (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={cardImportance}
              onValueChange={itemValue => setCardImportance(itemValue)}
              style={styles.picker}>
              <Picker.Item label="High" value="High" />
              <Picker.Item label="Medium" value="Medium" />
              <Picker.Item label="Low" value="Low" />
            </Picker>
          </View>
        ) : (
          <TextInput
            value={cardImportance}
            onChangeText={setCardImportance}
            placeholder="Importance (High/Medium/Low)"
            style={styles.input}
          />
        )}
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            onPress={handleSavePreviewCard}
            style={[styles.submitButton, {flex: 1, marginRight: 5}]}>
            <Text style={styles.submitButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDeleteCard}
            style={[
              styles.submitButton,
              {backgroundColor: '#dc3545', flex: 1, marginLeft: 5},
            ]}>
            <Text style={styles.submitButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>

      {/* Lists & Cards */}
      <View style={styles.body}>
        {lists.length === 0 ? (
          <Text style={styles.placeholderText}>
            Your task list will appear here
          </Text>
        ) : (
          <DraggableFlatList
            data={lists}
            keyExtractor={(card, cardIndex) => `${card.title}-${cardIndex}`}
            onDragEnd={({data}) => {
              setLists(data);
              setSelectedListIndex(null); // reset to avoid pointing to wrong list
            }}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index, drag, isActive}) => (
              <ScaleDecorator>
                <TouchableOpacity
                  onLongPress={drag}
                  disabled={isActive}
                  activeOpacity={1}
                  style={styles.listItem}>
                  <Text style={styles.listTitle}>{item.title}</Text>
                  <View
                    id="carousel-component"
                    dataSet={{kind: 'basic-layouts', name: 'left-align'}}>
                    <Carousel
                      loop
                      snapEnabled
                      pagingEnabled
                      width={280}
                      height={100}
                      data={item.cards}
                      mode="parallax"
                      modeConfig={{
                        parallaxScrollingScale: 1,
                        parallaxScrollingOffset: 100,
                        parallaxAdjacentItemScale: 1,
                      }}
                      autoPlayInterval={2000}
                      onSnapToItem={index =>
                        console.log('current index:', index)
                      }
                      renderItem={({item: card, index: cardIndex}) => (
                        <TouchableOpacity
                          key={`${card.title}-${cardIndex}`}
                          style={[
                            styles.card,
                            {
                              width: 150,
                              marginHorizontal: 10,
                              borderWidth: 1,
                              borderColor:
                                card.importance === 'High'
                                  ? '#ffcccc'
                                  : card.importance === 'Low'
                                  ? '#ccffcc'
                                  : '#fff2cc',
                            },
                          ]}
                          onPress={() => handlePreviewCard(item.id, cardIndex)}>
                          <Text style={styles.cardTitle}>{card.title}</Text>
                          <Text style={styles.cardDesc}>
                            {card.description}
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color:
                                card.importance === 'High'
                                  ? '#cc0000'
                                  : card.importance === 'Low'
                                  ? '#339933'
                                  : '#e6b800',
                            }}>
                            Importance: {card.importance}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.addCardButton}
                    onPress={() => handleAddCard(item.id)}>
                    <Text style={styles.addCardText}>+ Add Card</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </ScaleDecorator>
            )}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f2f2f2',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  leftButtons: {
    flexDirection: 'row',
  },
  button: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#007bff',
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  logo: {
    width: 50,
    height: 40,
  },
  body: {
    flex: 1,
    padding: 16,
  },
  placeholderText: {
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
    color: '#333',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  listItem: {
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  addCardButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  addCardText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
  card: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 10,
    width: 200,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
  },
  cardDesc: {
    fontSize: 13,
    color: '#666',
  },
  cardImportance: {
    fontSize: 12,
    color: '#999',
  },
});
