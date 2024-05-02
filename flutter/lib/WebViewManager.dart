import 'dart:ui';
import 'package:webview_flutter/webview_flutter.dart';

class WebViewManager {
  WebViewManager(String url) {
    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0x00000000))      
      ..loadRequest(Uri.parse(url));
  }
  
  late WebViewController controller;
}
