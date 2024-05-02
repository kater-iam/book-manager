import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:barcode_scan2/barcode_scan2.dart';
import 'package:flutter_nfc_kit/flutter_nfc_kit.dart';

class WebViewExample extends StatefulWidget {
  const WebViewExample({super.key});

  @override
  State<WebViewExample> createState() => _WebViewExampleState();
}

class _WebViewExampleState extends State<WebViewExample> {
  late final WebViewController _controller;

  /// ページURL
  static const url = 'https://hoshizaki.co.jp/';

  @override
  void initState() {
    super.initState();

    late final PlatformWebViewControllerCreationParams params;
    params = const PlatformWebViewControllerCreationParams();

    final WebViewController controller =
        WebViewController.fromPlatformCreationParams(params);

    controller
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color.fromARGB(255, 255, 255, 255))
      ..addJavaScriptChannel(
        'BarcodeReader',
        onMessageReceived: (JavaScriptMessage message) async {
          final ScanResult result = await BarcodeScanner.scan();
          final String isbn = result.rawContent;
          controller.runJavaScript("receiveBarcode('${isbn}');");
        },
      )
      ..addJavaScriptChannel(
        'NFCReader',
        onMessageReceived: (JavaScriptMessage message) async {
          NFCTag serialNumber = await FlutterNfcKit.poll(
            timeout: const Duration(seconds: 10),
            iosAlertMessage: "NFCタグを近づけてください",
          );
          await FlutterNfcKit.finish();
          controller.runJavaScript("receiveTagId('${serialNumber.id}');");
        },
      )
      ..loadRequest(Uri.parse(url));

    _controller = controller;
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Colors.white,
      resizeToAvoidBottomInset: false,
      body: Stack(
        children: [
          // WebViewWidget(controller: _controller),
          Text("hoge")
        ],
      ),
    );
  }
}
