import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

export default function QRCodePage() {
  const [activeTab, setActiveTab] = useState<'my-qr' | 'scan'>('my-qr');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const handleTabSwitch = (tab: 'my-qr' | 'scan') => {
    setActiveTab(tab);
    setScanned(false);
  };

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    Alert.alert(
      'QR Code Scanned',
      `Type: ${type}\nData: ${data}`,
      [
        {
          text: 'Scan Again',
          onPress: () => setScanned(false),
        },
        {
          text: 'OK',
          style: 'default',
        },
      ]
    );
  };

  const toggleFlash = () => {
    setFlashOn(!flashOn);
  };

  const requestCameraPermission = async () => {
    const { status } = await requestPermission();
    if (status !== 'granted') {
      Alert.alert(
        'Camera Permission Required',
        'Please grant camera permission to scan QR codes.',
        [{ text: 'OK' }]
      );
    }
  };

  useEffect(() => {
    if (activeTab === 'scan' && !permission?.granted) {
      requestCameraPermission();
    }
  }, [activeTab]);

  const renderMyQR = () => (
    <View style={styles.myQRContainer}>
      <View style={styles.qrCodeContainer}>
        {/* QR Code Placeholder - In real app, use react-native-qrcode-svg */}
        <View style={styles.qrCodePlaceholder}>
          <View style={styles.qrPattern}>
            {Array.from({ length: 25 }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.qrDot,
                  Math.random() > 0.5 && styles.qrDotFilled,
                ]}
              />
            ))}
          </View>
        </View>
      </View>
      
      <View style={styles.qrInfo}>
        <Text style={styles.qrTitle}>Your Digital ID</Text>
        <Text style={styles.qrSubtitle}>John Doe</Text>
        <Text style={styles.qrId}>ID: NP-123456789</Text>
        <Text style={styles.qrDescription}>
          Show this QR code to verify your identity at government offices and authorized centers.
        </Text>
      </View>

      <View style={styles.qrActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="download" size={moderateScale(20)} color="#059669" />
          <Text style={styles.actionButtonText}>Save QR</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share" size={moderateScale(20)} color="#059669" />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderScanner = () => {
    if (!permission) {
      return (
        <View style={styles.permissionContainer}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.permissionText}>Requesting camera permission...</Text>
        </View>
      );
    }

    if (!permission.granted) {
      return (
        <View style={styles.permissionContainer}>
          <Ionicons name="camera" size={moderateScale(64)} color="#6b7280" />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need access to your camera to scan QR codes
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.scannerContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          flash={flashOn ? 'on' : 'off'}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        >
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            
            <Text style={styles.scannerText}>
              Position QR code within the frame
            </Text>
          </View>
        </CameraView>

        <View style={styles.scannerControls}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
            <Ionicons 
              name={flashOn ? "flash" : "flash-off"} 
              size={moderateScale(24)} 
              color="#ffffff" 
            />
          </TouchableOpacity>
        </View>

        {scanned && (
          <View style={styles.scannedOverlay}>
            <View style={styles.scannedContainer}>
              <Ionicons name="checkmark-circle" size={moderateScale(48)} color="#10b981" />
              <Text style={styles.scannedText}>QR Code Scanned Successfully!</Text>
              <TouchableOpacity 
                style={styles.scanAgainButton} 
                onPress={() => setScanned(false)}
              >
                <Text style={styles.scanAgainButtonText}>Scan Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
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
        <Text style={styles.headerTitle}>QR Code</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my-qr' && styles.activeTab]}
          onPress={() => handleTabSwitch('my-qr')}
        >
          <Ionicons 
            name="qr-code" 
            size={moderateScale(20)} 
            color={activeTab === 'my-qr' ? '#ffffff' : '#059669'} 
          />
          <Text style={[styles.tabText, activeTab === 'my-qr' && styles.activeTabText]}>
            My QR
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'scan' && styles.activeTab]}
          onPress={() => handleTabSwitch('scan')}
        >
          <Ionicons 
            name="scan" 
            size={moderateScale(20)} 
            color={activeTab === 'scan' ? '#ffffff' : '#059669'} 
          />
          <Text style={[styles.tabText, activeTab === 'scan' && styles.activeTabText]}>
            Scan QR
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'my-qr' ? renderMyQR() : renderScanner()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: scale(8),
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: '#065f46',
  },
  headerSpacer: {
    width: scale(40),
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: scale(24),
    marginTop: verticalScale(20),
    backgroundColor: '#f3f4f6',
    borderRadius: moderateScale(12),
    padding: scale(4),
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(8),
    gap: scale(8),
  },
  activeTab: {
    backgroundColor: '#059669',
  },
  tabText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#059669',
  },
  activeTabText: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    marginTop: verticalScale(20),
  },
  // My QR Styles
  myQRContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: scale(24),
  },
  qrCodeContainer: {
    backgroundColor: '#ffffff',
    padding: scale(20),
    borderRadius: moderateScale(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: verticalScale(24),
  },
  qrCodePlaceholder: {
    width: scale(200),
    height: scale(200),
    backgroundColor: '#ffffff',
    borderRadius: moderateScale(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  qrPattern: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: scale(150),
    height: scale(150),
  },
  qrDot: {
    width: scale(6),
    height: scale(6),
    backgroundColor: '#f3f4f6',
    margin: scale(1),
  },
  qrDotFilled: {
    backgroundColor: '#000000',
  },
  qrInfo: {
    alignItems: 'center',
    marginBottom: verticalScale(32),
  },
  qrTitle: {
    fontSize: moderateScale(24),
    fontWeight: '600',
    color: '#065f46',
    marginBottom: verticalScale(8),
  },
  qrSubtitle: {
    fontSize: moderateScale(18),
    fontWeight: '500',
    color: '#059669',
    marginBottom: verticalScale(4),
  },
  qrId: {
    fontSize: moderateScale(14),
    color: '#6b7280',
    marginBottom: verticalScale(16),
  },
  qrDescription: {
    fontSize: moderateScale(14),
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: moderateScale(20),
    paddingHorizontal: scale(16),
  },
  qrActions: {
    flexDirection: 'row',
    gap: scale(16),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: '#a7f3d0',
    gap: scale(8),
  },
  actionButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#059669',
  },
  // Scanner Styles
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: scale(250),
    height: scale(250),
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: scale(20),
    height: scale(20),
    borderColor: '#10b981',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scannerText: {
    color: '#ffffff',
    fontSize: moderateScale(16),
    textAlign: 'center',
    marginTop: verticalScale(32),
    paddingHorizontal: scale(32),
  },
  scannerControls: {
    position: 'absolute',
    bottom: verticalScale(50),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  controlButton: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Permission Styles
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(32),
  },
  permissionTitle: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: '#065f46',
    marginTop: verticalScale(16),
    marginBottom: verticalScale(8),
  },
  permissionText: {
    fontSize: moderateScale(14),
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: moderateScale(20),
    marginBottom: verticalScale(24),
  },
  permissionButton: {
    backgroundColor: '#059669',
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(8),
  },
  permissionButtonText: {
    color: '#ffffff',
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
  // Scanned Overlay Styles
  scannedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannedContainer: {
    backgroundColor: '#ffffff',
    padding: scale(32),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    marginHorizontal: scale(32),
  },
  scannedText: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#065f46',
    textAlign: 'center',
    marginTop: verticalScale(16),
    marginBottom: verticalScale(24),
  },
  scanAgainButton: {
    backgroundColor: '#059669',
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(8),
  },
  scanAgainButtonText: {
    color: '#ffffff',
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
});