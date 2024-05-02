import 'package:barcode_scan2/barcode_scan2.dart';
import 'package:flutter/material.dart';
import 'package:flutter_nfc_kit/flutter_nfc_kit.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:webview/WebViewManager.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(WebViewApp());
}

class WebViewApp extends ConsumerStatefulWidget {
  WebViewApp({Key? key}) : super(key: key);

  @override
  _WebViewAppState createState() => _WebViewAppState();
}

class _WebViewAppState extends ConsumerState<WebViewApp> {
  late WebViewController _controller;

  @override
  void initState() {
    super.initState();
    _controller = WebViewManager('http://192.168.11.21:5173/').controller;

    _controller.addJavaScriptChannel(
      'BarcodeReader',
      onMessageReceived: (JavaScriptMessage message) async {
        final ScanResult result = await BarcodeScanner.scan();
        final String isbn = result.rawContent;
        _controller.runJavaScript("receiveBarcode('${isbn}');");
      },
    );
    _controller.addJavaScriptChannel(
      'NFCReader',
      onMessageReceived: (JavaScriptMessage message) async {
        NFCTag serialNumber = await FlutterNfcKit.poll(
          timeout: const Duration(seconds: 10),
          iosAlertMessage: "NFCタグを近づけてください",
        );
        await FlutterNfcKit.finish();
        _controller.runJavaScript("receiveSerialNumber('${serialNumber.id}');");
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: WebViewWidget(
          controller: _controller,
        ),
      ),
    );
  }
}