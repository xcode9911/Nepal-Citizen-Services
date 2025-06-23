import { useState, useEffect, useRef } from "react"
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Alert,
  SafeAreaView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"

const { width, height } = Dimensions.get("window")

// Responsive scaling functions
const scale = (size: number) => (width / 375) * size
const verticalScale = (size: number) => (height / 812) * size
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor

// Sample suggestions for citizen services
const SUGGESTIONS = [
  "How to renew citizenship?",
  "Document requirements?",
  "Payment methods?",
  "Processing time?",
  "Office locations?",
  "Contact support?",
]

export default function ChatSupportScreen() {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "ai"; timestamp: Date }[]>([
    {
      text: "Hello! I'm your Nepal Citizen Services support assistant. How can I help you with your documents, applications, or services today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)

  const handleGoBack = () => {
    router.back()
  }

  // Function to format text with bold styling
  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g)

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const boldText = part.slice(2, -2)
        return (
          <Text key={index} style={styles.boldText}>
            {boldText}
          </Text>
        )
      }
      return part
    })
  }

  const sendMessage = async (messageText = input) => {
    if (!messageText.trim()) return

    const userMessage = messageText
    setMessages((prev) => [...prev, { text: userMessage, sender: "user", timestamp: new Date() }])
    setInput("")
    setIsLoading(true)

    try {
      // Government of Nepal accurate responses
      const simulatedResponses = {
        "How to renew citizenship?": "**Citizenship Certificate Renewal Process:**\n\n**Required Documents:**\n• Original citizenship certificate\n• 2 passport-size photos\n• Filled application form\n• Copy of ward recommendation\n\n**Process:**\n1. Visit District Administration Office (DAO)\n2. Submit documents with application\n3. Pay fee: Rs. 100 (normal), Rs. 500 (urgent)\n4. Collect within 15 days (normal) or same day (urgent)\n\n**Office Hours:** 10:00 AM - 5:00 PM (Sun-Thu)\n\n*Demo app - visit official DAO for actual service*",
        
        "Document requirements?": "**Common Document Requirements:**\n\n**For Citizenship Certificate:**\n• Birth certificate or school certificate\n• Parents' citizenship certificates\n• Ward recommendation letter\n• 2 passport-size photos\n\n**For Passport:**\n• Citizenship certificate (original + copy)\n• 2 passport-size photos (white background)\n• Filled application form\n• Fee payment receipt\n\n**For Driving License:**\n• Citizenship certificate copy\n• Medical certificate\n• 2 passport-size photos\n• Driving training certificate\n\n*Requirements may vary by district*",
        
        "Payment methods?": "**Government Fee Payment Methods:**\n\n**At Government Offices:**\n• Cash payment at counter\n• Bank voucher/challan\n\n**Online Services:**\n• eSewa (selected services)\n• Khalti (limited services)\n• Connect IPS\n• Bank transfer\n\n**Fee Structure:**\n• Citizenship: Rs. 100-500\n• Passport: Rs. 5,000-15,000\n• License: Rs. 1,000-2,000\n\n*Fees subject to government revision*\n*Demo app - no real payments processed*",
        
        "Processing time?": "**Official Processing Times:**\n\n**District Administration Office:**\n• Citizenship: 15 days (normal), 1 day (urgent)\n• Recommendation letters: 1-3 days\n\n**Department of Passports:**\n• Normal passport: 15 working days\n• Express passport: 7 working days\n• Urgent passport: 1-2 working days\n\n**Transport Management Office:**\n• Driving license: 7-15 days\n• Vehicle registration: 1-3 days\n\n*Times may vary during peak seasons*",
        
        "Office locations?": "**Major Government Offices:**\n\n**Kathmandu DAO**\n📍 Babar Mahal, Kathmandu\n📞 01-4200000\n🕒 10:00 AM - 5:00 PM (Sun-Thu)\n\n**Department of Passports**\n📍 Tripureshwor, Kathmandu\n📞 01-4200000\n🕒 10:00 AM - 5:00 PM (Sun-Thu)\n\n**Transport Management Office**\n📍 Ekantakuna, Lalitpur\n📞 01-5000000\n🕒 10:00 AM - 5:00 PM (Sun-Thu)\n\n*Visit official websites for complete list*",
        
        "Contact support?": "**Government Helplines:**\n\n📞 **National Helpline:** 1180 (Toll-free)\n📞 **DAO Helpline:** 01-4200000\n📞 **Passport Helpline:** 01-4200000\n📞 **Transport Helpline:** 01-5000000\n\n**Online Services:**\n🌐 **nagarikta.gov.np** (Citizenship)\n🌐 **nepalpassport.gov.np** (Passport)\n🌐 **dotm.gov.np** (Transport)\n\n**Office Hours:** 10:00 AM - 5:00 PM (Sun-Thu)\n**Closed:** Friday, Saturday & Public Holidays\n\n*Demo app - use official channels for real support*"
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500))

      let aiResponse = simulatedResponses[messageText as keyof typeof simulatedResponses]
      
      if (!aiResponse) {
        aiResponse = `Thank you for asking about "${messageText}". \n\n**I can help you with:**\n• Citizenship certificate services\n• Passport applications\n• Driving license procedures\n• Document requirements\n• Government office information\n• Processing times and fees\n\nPlease try one of the suggested topics or contact the relevant government office directly.\n\n**Important:** This is a demo app. For official services, visit:\n• District Administration Office (DAO)\n• Department of Passports\n• Transport Management Office\n• Ward offices for local services`
      }

      setMessages((prev) => [...prev, { text: aiResponse, sender: "ai", timestamp: new Date() }])
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble connecting right now. Please contact the government helpline at 1180 or visit your nearest government office.",
          sender: "ai",
          timestamp: new Date(),
        },
      ])
      Alert.alert("Connection Error", "Please try again or contact government helpline: 1180")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }
  }, [messages])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={Platform.OS === 'android' ? '#ffffff' : undefined}
        translucent={false}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={moderateScale(24)} color="#065f46" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support Chat</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, index) => (
          <View key={index} style={styles.messageContainer}>
            <View
              style={[
                styles.messageWrapper,
                msg.sender === "user" ? styles.userMessageWrapper : styles.aiMessageWrapper,
              ]}
            >
              <View style={[styles.message, msg.sender === "user" ? styles.userMessage : styles.aiMessage]}>
                <Text style={[styles.messageText, msg.sender === "user" ? styles.userText : styles.aiText]}>
                  {msg.sender === "ai" ? formatText(msg.text) : msg.text}
                </Text>
              </View>
            </View>
            <View
              style={[styles.timestampContainer, msg.sender === "user" ? styles.userTimestamp : styles.aiTimestamp]}
            >
              <Text style={styles.timestamp}>{formatTime(msg.timestamp)}</Text>
            </View>
          </View>
        ))}
        {isLoading && (
          <View style={styles.messageContainer}>
            <View style={styles.aiMessageWrapper}>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#059669" />
                <Text style={styles.loadingText}>Typing...</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Suggestions - Fixed Height */}
      {messages.length < 3 && (
        <View style={styles.suggestionsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsContainer}
          >
            {SUGGESTIONS.map((suggestion, index) => (
              <TouchableOpacity key={index} style={styles.suggestionChip} onPress={() => sendMessage(suggestion)}>
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Ask about documents, services, or support..."
              placeholderTextColor="#9ca3af"
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
              onPress={() => sendMessage()}
              disabled={!input.trim() || isLoading}
            >
              <Ionicons
                name="send"
                size={moderateScale(18)}
                color={input.trim() && !isLoading ? "#ffffff" : "#a7f3d0"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  backButton: {
    padding: scale(8),
    width: scale(40),
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: '#065f46',
    textAlign: 'center',
  },
  headerSpacer: {
    width: scale(40),
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#f8fffe',
  },
  chatContent: {
    padding: scale(16),
    paddingBottom: scale(24),
  },
  messageContainer: {
    marginBottom: verticalScale(16),
    width: "100%",
  },
  messageWrapper: {
    maxWidth: "85%",
  },
  userMessageWrapper: {
    alignSelf: "flex-end",
  },
  aiMessageWrapper: {
    alignSelf: "flex-start",
  },
  message: {
    borderRadius: moderateScale(16),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
  },
  userMessage: {
    backgroundColor: "#059669",
    borderBottomRightRadius: moderateScale(4),
  },
  aiMessage: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    borderBottomLeftRadius: moderateScale(4),
  },
  messageText: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
  },
  userText: {
    color: "#ffffff",
  },
  aiText: {
    color: "#065f46",
  },
  boldText: {
    fontWeight: "700",
    color: "#065f46",
  },
  timestampContainer: {
    marginTop: verticalScale(4),
    paddingHorizontal: scale(4),
  },
  userTimestamp: {
    alignItems: "flex-end",
  },
  aiTimestamp: {
    alignItems: "flex-start",
  },
  timestamp: {
    fontSize: moderateScale(12),
    color: "#6b7280",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: moderateScale(16),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderWidth: 1,
    borderColor: "#a7f3d0",
    borderBottomLeftRadius: moderateScale(4),
  },
  loadingText: {
    fontSize: moderateScale(16),
    color: "#6b7280",
    marginLeft: scale(8),
  },
  // Fixed suggestion styling
  suggestionsWrapper: {
    height: verticalScale(50), // Fixed height container
    backgroundColor: '#ffffff',
  },
  suggestionsContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    alignItems: 'center',
  },
  suggestionChip: {
    backgroundColor: "#ecfdf5",
    borderRadius: moderateScale(20),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderWidth: 1,
    borderColor: "#a7f3d0",
    marginRight: scale(8),
    height: verticalScale(34), // Fixed height
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionText: {
    fontSize: moderateScale(13),
    color: "#059669",
    fontWeight: "500",
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    position: "relative",
  },
  input: {
    flex: 1,
    backgroundColor: "#f8fffe",
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: "#a7f3d0",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    paddingRight: scale(44),
    fontSize: moderateScale(16),
    maxHeight: verticalScale(120),
    color: "#065f46",
    textAlignVertical: "top",
    marginRight: scale(8),
  },
  sendButton: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: "#059669",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    marginBottom: scale(2),
  },
  sendButtonDisabled: {
    backgroundColor: "#d1fae5",
  },
})