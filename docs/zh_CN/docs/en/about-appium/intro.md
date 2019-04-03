## Appium 简介

Appium 是一款开源工具,，用于自动化 iOS、Android 和 Windows 桌面平台上的原生、web 和混合应用程序。 **原生应用**指那些用 iOS 、 Android 或者 Windows SDK 编写的应用程序。 **web 应用程序**是指使用移动端浏览器访问的应用（Appuium 支持 iOS 、 Chrome 或 Android 上构建的“浏览器”应用）。 **混合应用**带有一个 "webview" 的包装器——用来和 Web 内容交互的原生控件。 类似 [Phonegap](http://phonegap.com/) 的项目，让用 Web 技术开发然后打包进原生包装器创建一个混合应用变得容易了。

重要的是, Appium 是 "跨平台": 它允许您使用相同的 API 对 多个平台 (iOS、Android、Windows) 进行测试。 这将在 iOS、Android 和 Windows 测试套件之间实现 代码重用。

了解 Appium “支持”这些平台意味着什么、有哪些自动化方式的详细信息，请参见 [Appium 支持的平台](/docs/en/about-appium/platform-support.md)。

### Appium 哲学理念

该应用程序旨在根据以下四项原则概述的满足移动自动化需要：

1. 你没有必要为了自动化而重新编译你的应用或者以任何方式修改它。
2. 你不应该被限制在特定的语言或框架上来编写运行测试。
3. 移动端自动化框架在自动化接口方面不应该重造轮子。
4. 移动端自动化框架应该开源，不但在名义上而且在精神和实践上都要实至名归。

### Appium 设计理念

那么 Appium 项目的架构如何实现这一理念呢？ 为了实现第一点要求，我们其实使用了系统自带的自动化框架。 这样，我们不需要把 Appium 特定的或者第三方的代码编译进你的应用。这意味着**你测试使用的应用与最终发布的应用并无二致**。 我们使用以下系统自带的自动化框架：

* iOS 9.3 及以上：苹果的 [XCUITest](https://developer.apple.com/reference/xctest)
* iOS 9.3 及以下：苹果的 [UIAutomation](https://developer.apple.com/library/ios/documentation/DeveloperTools/Reference/UIAutomationRef/)
* Android 4.2+: 谷歌的 [UiAutomator/UiAutomator2](http://developer.android.com/tools/help/uiautomator/index.html)
* Android 2.3+: 谷歌的 [Instrumentation](http://developer.android.com/reference/android/app/Instrumentation.html). （通过绑定另外的项目—— [Selendroid](http://selendroid.io) 提供 Instrumentation 的支持）
* Windows: 微软的 [WinAppDriver](http://github.com/microsoft/winappdriver)

为了实现第二点要求，我们把这些（系统本身的）供应商提供的框架包装进一套 API —— [WebDriver](http://docs.seleniumhq.org/projects/webdriver/) API 中。 WebDriver（也叫 "Selenium WebDriver"）规定了一个客户端-服务器协议（称为 [JSON Wire Protocol](https://w3c.github.io/webdriver/webdriver-spec.html)）， 按照这种客户端-服务器架构，可以使用任何语言编写的客户端向服务器发送适当的 HTTP 请求。 已经有[各个流行编程语言编写的客户端](http://appium.io/downloads)了。 这也意味着你可以自由使用任何你想要的测试运行器和测试框架；客户端程序库不过是 HTTP 客户端，可以以任何你喜欢的方式混入你的代码。 换句话说，Appium & WebDriver 客户端不是严格意义上的“测试框架”，而是“自动化程序库”。 你可以以任何你喜欢的方式管理你的测试环境！

我们以同样的方式实现第三点要求：WebDriver 已经成为 Web 浏览器自动化事实上的标准，并且是一个 [W3C 工作草案](https://dvcs.w3.org/hg/webdriver/raw-file/tip/webdriver-spec.html)。 何必在移动端做完全不同的尝试？ 相反，我们[扩展了协议](https://github.com/SeleniumHQ/mobile-spec/blob/master/spec-draft.md)使用额外的API方法用于移动端自动化。

显然，第四点是肯定的，你正在读这个 因为[Appium 是开源的](https://github.com/appium/appium)。

### Appium 概念

**客户端/服务器架构**  
Appium的核心是一个公开 REST API 的 Web 服务器。 它接收来自客户机的连接，侦听命令，在移动设备上执行这些命令，并使用表示命令执行结果的HTTP响应进行响应。 客户端/服务器架构实际给予了许多可能性：我们可以使用任何有 http 客户端 API 的语言编写我们的测试代码，但是使用[Appium 客户端程序库](http://appium.io/downloads)更容易。 我们可以将服务器放在不同于运行测试的机器上。 我们可以编写测试代码，并依靠类似 [Sauce Labs](https://saucelabs.com/mobile) 的云服务接收和解释命令。

**会话（session）**  
自动化始终在一个会话的上下文中执行， 客户端以特定于每个库的方式与服务器初始化会话，但最终它们都向服务器发送一个`POST /session`请求，并包含一个名为“desired capabilities”（所需功能）对象的 JSON 对象。 这时服务器就会开启这个自动化会话，并返回一个用于发送后续命令的会话 ID。

**Desired Capabilities**  
Desired capabilities 是一些发送给 Appium 服务器的键值对集合 (比如 map 或 hash），告诉服务器我们想要启动什么类型的自动化会话。 还有多种 capabilities 可以在自动化过程中修改服务器的行为。 例如，我们可以把 `platformName` capability 设置为 `iOS`，告诉 Appium 我们想要 iOS 会话，而不是 Android 或者 Windows 会话。 Or we might set the `safariAllowPopups` capability to `true` in order to ensure that, during a Safari automation session, we're allowed to use JavaScript to open up new windows. See the [capabilities doc](/docs/en/writing-running-appium/caps.md) for the complete list of capabilities available for Appium.

**Appium Server**  
Appium is a server written in Node.js. It can be built and installed [from source](/docs/en/contributing-to-appium/appium-from-source.md) or installed directly from NPM:

    $ npm install -g appium
    $ appium
    

**Appium Clients**  
There are client libraries (in Java, Ruby, Python, PHP, JavaScript, and C#) which support Appium's extensions to the WebDriver protocol. When using Appium, you want to use these client libraries instead of your regular WebDriver client. You can view the full list of libraries [here](/docs/en/about-appium/appium-clients.md).

**[Appium Desktop](https://github.com/appium/appium-desktop)**  
There is a GUI wrapper around the Appium server that can be downloaded for any platform. It comes bundled with everything required to run the Appium server, so you don't need to worry about Node. It also comes with an Inspector, which enables you to check out the hierarchy of your app. This can come in handy when writing tests.

### Getting Started

Congratulations! You are now armed with enough knowledge to begin using Appium. Why not head to the [getting started doc](/docs/en/about-appium/getting-started.md) for more detailed requirements and instructions?