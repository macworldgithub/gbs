import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'tailwind-react-native-classnames';

export default function Scanner() {
  const navigation = useNavigation();

  const user = {
    name: 'Olivia Nguyen',
    avatar: require('../../assets/user.png'),
  };

  const handleConnect = () => {
    console.log(`Connecting with ${user.name}...`);
  };

  return (
    <View style={tw`flex-1 bg-white `}>
      {/* Header */}
      <View style={tw`flex-row items-center px-4 py-4 mt-4`}>
        <TouchableOpacity onPress={() => navigation.goBack('QRScanScreen')}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`ml-4 text-lg font-semibold`}>Scan QR Code</Text>
      </View>

      {/* QR Scanner Area */}
      <View style={tw`flex-1 items-center justify-center bg-gray-300 mx-4 rounded-xl mt-4`}>
        <View style={tw`w-60 h-60 bg-gray-300 rounded-xl border-4 border-white`} />
        <TouchableOpacity style={[tw`absolute`, { top: 16, right: 16 }]}>
          <Ionicons name="flash" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* User Info + Connect Button */}
      <View style={tw`bg-white px-6 py-4 rounded-t-3xl shadow-md`}>
        <View style={tw`flex-row items-center mb-4`}>
          <Image
            source={user.avatar}
            style={tw`w-10 h-10 rounded-full mr-4`}
            resizeMode="cover"
          />
          <Text style={tw`text-base font-medium`}>{user.name}</Text>
        </View>
        <TouchableOpacity
          onPress={handleConnect}
          style={tw`bg-white border border-red-500 rounded-full py-2`}
        >
          <Text style={tw`text-center text-red-500 font-semibold`}>Connect</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
