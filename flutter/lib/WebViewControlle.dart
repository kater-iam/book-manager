import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class WebViewManager {
  final String initialUrl;
  late final WebViewController controller;

  WebViewManager({required this.initialUrl}) {
    initController();
  }

  void initController() {
    final params = const PlatformWebViewControllerCreationParams();
    controller = WebViewController.fromPlatformCreationParams(params);

    controller
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color.fromARGB(255, 255, 255, 255))
      ..loadRequest(Uri.parse(initialUrl));
  }

  void addJavaScriptChannel(
      String channelName, JavaScriptChannelCallback callback) {
    controller.addJavaScriptChannel(channelName, onMessageReceived: callback);
  }
}

typedef JavaScriptChannelCallback = void Function(JavaScriptMessage message);
