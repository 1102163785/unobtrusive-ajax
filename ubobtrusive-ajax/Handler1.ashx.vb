﻿Imports System.Web
Imports System.Web.Services

Public Class Handler1
    Implements System.Web.IHttpHandler

    Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest

        Dim path As String = HttpContext.Current.Server.MapPath($"~/Uploads/{IO.Path.GetFileName(HttpContext.Current.Request.Files(0).FileName)}")
        HttpContext.Current.Request.Files(0).SaveAs(path)

        context.Response.ContentType = "text/plain"
        context.Response.Write("Hello World!")

    End Sub

    ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property

End Class